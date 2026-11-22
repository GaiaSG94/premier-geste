/* Premier Geste — moteur du Guide pas à pas (commun aux 3 directions).
   Audio : synthèse vocale du navigateur (fr-FR, voix féminine si dispo),
   métronome WebAudio 110/min pour le massage cardiaque.
   Chaque direction fournit render(g) → HTML ; les boutons portent data-a. */
(function () {
  const hasTTS = 'speechSynthesis' in window;
  let voiceFR = null;
  function pickVoice() {
    const vs = speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang));
    voiceFR = vs.find(v => /denise|julie|hortense|am[eé]lie|audrey|marie|eloise|vivienne|female/i.test(v.name)) || vs[0] || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

  /* --- métronome (un seul pour toute la planche) --- */
  const metro = { ctx: null, timer: null, owner: null };
  function tick() {
    const c = metro.ctx, o = c.createOscillator(), gn = c.createGain();
    o.frequency.value = 1050;
    gn.gain.setValueAtTime(0.35, c.currentTime);
    gn.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
    o.connect(gn).connect(c.destination); o.start(); o.stop(c.currentTime + 0.07);
  }
  function metroStop() {
    clearInterval(metro.timer); metro.timer = null;
    const g = metro.owner; metro.owner = null; if (g) g.paint();
  }
  function metroStart(g) {
    metroStop();
    metro.ctx = metro.ctx || new (window.AudioContext || window.webkitAudioContext)();
    metro.owner = g; g.paint();
    metro.timer = setInterval(() => {
      tick(); g.el.classList.add('beat'); setTimeout(() => g.el.classList.remove('beat'), 140);
    }, 545); /* 110 compressions / min */
  }

  let speaker = null; /* guide en train de parler */

  class Guide {
    constructor(el, o) {
      Object.assign(this, { el, u: o.u || 'rcp', i: o.i || 0, render: o.render, auto: !!o.auto, speaking: false, tok: 0 });
      el.addEventListener('click', e => {
        const a = e.target.closest('[data-a]');
        if (a && el.contains(a)) this.act(a.dataset.a, a.dataset.v);
      });
      this.paint();
    }
    get U() { return window.URG_BY_ID[this.u]; }
    get S() { return this.U.steps[this.i]; }
    get n() { return this.U.steps.length; }
    get il() { return this.S.il || this.u; }
    get metroOn() { return metro.owner === this; }
    act(a, v) {
      const map = {
        next: () => this.go(this.i + 1), prev: () => this.go(this.i - 1), step: () => this.go(+v),
        play: () => (this.speaking ? this.hush() : this.say()),
        auto: () => { this.auto = !this.auto; this.auto ? this.say() : this.hush(); },
        metro: () => (this.metroOn ? metroStop() : metroStart(this)),
        urg: () => this.load(v), call: () => this.toast('Appel du ' + v + ' — simulation')
      };
      (map[a] || (() => {}))();
    }
    go(i) {
      if (i < 0 || i >= this.n) return;
      this.i = i; if (this.metroOn && !this.S.metro) metroStop();
      this.hush(true); this.paint(); if (this.auto) this.say();
    }
    load(u) { this.u = u; this.i = 0; if (this.metroOn) metroStop(); this.hush(true); this.paint(); this.el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    speech() { const s = this.S; return s.t + '. ' + s.x + (s.no ? ' Ne pas : ' + s.no.join(', ') + '.' : ''); }
    /* 1) fichier audio/<urgence>-<étape>.wav (voix enregistrée), 2) repli : synthèse du navigateur */
    say() {
      if (speaker && speaker !== this) speaker.hush();
      this.hush(true);
      const tok = ++this.tok;
      const done = () => { if (this.tok !== tok) return; this.speaking = false; this.audio = null; speaker = null; this.paint(); };
      let fell = false;
      const fallback = () => { if (fell || this.tok !== tok) return; fell = true; this.audio = null; this.tts(done); };
      speaker = this; this.speaking = true; this.paint();
      const au = new Audio(`audio/${this.u}-${this.i + 1}.wav`);
      this.audio = au; au.onended = done; au.onerror = fallback;
      au.play().catch(fallback);
    }
    tts(done) {
      if (!hasTTS) { done(); return this.toast('Audio indisponible sur ce navigateur'); }
      const ut = new SpeechSynthesisUtterance(this.speech());
      ut.lang = 'fr-FR'; ut.rate = 0.95; if (voiceFR) ut.voice = voiceFR;
      ut.onend = ut.onerror = done; speechSynthesis.speak(ut);
    }
    hush(silent) {
      this.tok++;
      if (this.audio) { this.audio.pause(); this.audio = null; }
      if (speaker === this) { if (hasTTS) speechSynthesis.cancel(); speaker = null; }
      this.speaking = false; if (!silent) this.paint();
    }
    paint() {
      this.el.innerHTML = this.render(this);
      ['speaking', 'auto'].forEach(k => this.el.classList.toggle('is-' + k, this[k]));
      this.el.classList.toggle('is-metro', this.metroOn);
    }
    toast(msg) {
      const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
      this.el.appendChild(t); setTimeout(() => t.remove(), 1800);
    }
  }

  window.Guide = Guide;
  window.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* monte les 3 téléphones + la bande d'illustrations d'une planche */
  window.mountBoard = function (render, strip) {
    const guides = [...document.querySelectorAll('[data-guide]')].map(el => {
      const [u, i] = el.dataset.guide.split(':');
      return new Guide(el, { u, i: +i || 0, render });
    });
    const s = document.querySelector('.strip');
    if (s) {
      s.innerHTML = window.URG.map(u => `<button data-u="${u.id}" aria-label="Ouvrir ${esc(u.nom)}">${strip(u)}</button>`).join('');
      s.addEventListener('click', e => { const b = e.target.closest('[data-u]'); if (b) guides[0].load(b.dataset.u); });
    }
    return guides;
  };
})();
