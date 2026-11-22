/* Premier Geste — contenu des 8 urgences (source unique texte + audio).
   t = titre d'étape (affiché + lu), x = consigne (affichée + lue),
   il = illustration (défaut : celle de l'urgence), metro = métronome 110/min,
   no = gestes à NE PAS faire (affichés barrés).
   Contenu aligné sur les recommandations grand public françaises
   (gestes qui sauvent / PSC1) — à faire relire par un formateur. */
window.URG = [
  { id: 'rcp', nom: 'Arrêt cardiaque', signe: 'Ne répond pas, ne respire pas', steps: [
    { t: 'Appelez le 15', x: 'Mettez le haut-parleur. Faites chercher un défibrillateur.', il: 'call' },
    { t: 'Allongez-la sur le dos', x: 'Sur un sol dur. Mettez-vous à genoux à côté de sa poitrine.' },
    { t: 'Massez fort et vite', x: 'Mains au centre de la poitrine, bras tendus. Enfoncez de 5 cm, au rythme du bip.', metro: true },
    { t: 'Le défibrillateur arrive', x: 'Allumez-le et suivez sa voix. Ne cessez de masser que lorsqu’il le demande.', il: 'dae' },
    { t: 'Ne vous arrêtez pas', x: 'Continuez jusqu’à l’arrivée des secours ou si elle se remet à respirer.', metro: true }
  ]},
  { id: 'etouf', nom: 'Étouffement', signe: 'Ne peut ni parler, ni tousser', steps: [
    { t: 'Elle tousse ?', x: 'Encouragez-la à tousser. Ne tapez pas dans le dos tant qu’elle tousse.' },
    { t: '5 claques dans le dos', x: 'Penchez-la en avant. Frappez fort entre les omoplates, avec le talon de la main.', il: 'dos' },
    { t: '5 compressions', x: 'Derrière elle, poing au creux de l’estomac. Tirez fort vers vous et vers le haut.' },
    { t: 'Alternez 5 et 5', x: 'Jusqu’à ce que ça sorte. Si elle perd connaissance : 15 et massage cardiaque.' }
  ]},
  { id: 'hemo', nom: 'Hémorragie', signe: 'Le sang coule abondamment', steps: [
    { t: 'Appuyez fort sur la plaie', x: 'Avec un tissu propre, ou la main protégée par un gant ou un sac.' },
    { t: 'Allongez-la', x: 'Gardez la pression sans relâcher, même pour regarder.' },
    { t: 'Faites appeler le 15', x: 'Ne lâchez pas la plaie. Donnez l’adresse exacte.', il: 'call' },
    { t: 'Couvrez-la', x: 'Elle ne doit pas avoir froid. Parlez-lui, surveillez qu’elle répond.' }
  ]},
  { id: 'pls', nom: 'Inconscient qui respire', signe: 'Ne répond pas mais respire', steps: [
    { t: 'Elle respire ?', x: 'Regardez son ventre et sa poitrine se soulever, pendant 10 secondes.' },
    { t: 'Tournez-la sur le côté', x: 'Bras proche à angle droit, son autre main contre sa joue, genou opposé plié : faites-la rouler vers vous.' },
    { t: 'Bouche vers le sol', x: 'Tête légèrement en arrière, bouche ouverte, pour qu’elle respire librement.' },
    { t: 'Appelez le 15', x: 'Puis vérifiez sa respiration jusqu’à l’arrivée des secours.', il: 'call' }
  ]},
  { id: 'brul', nom: 'Brûlure', signe: 'Peau rouge, cloque, douleur', steps: [
    { t: 'Refroidissez tout de suite', x: 'Eau tempérée, pendant au moins 10 minutes.' },
    { t: 'Retirez ce qui serre', x: 'Bagues, montre, vêtements autour. Sauf ce qui colle à la peau.' },
    { t: 'Grave ? Appelez le 15', x: 'Plus grande que sa paume, cloque, ou visage, mains, cou : appelez.', il: 'call' },
    { t: 'Ne mettez rien dessus', x: 'Ne percez pas les cloques.', no: ['glace', 'beurre', 'dentifrice'] }
  ]},
  { id: 'avc', nom: 'AVC', signe: 'Visage, bras, parole : VITE', steps: [
    { t: 'Visage', x: 'Demandez-lui de sourire : la bouche part-elle de travers ?' },
    { t: 'Inertie d’un bras', x: 'Demandez-lui de lever les deux bras : l’un retombe-t-il ?' },
    { t: 'Trouble de la parole', x: 'Faites-lui répéter une phrase simple : parle-t-elle mal ?' },
    { t: 'En urgence : 15', x: 'Un seul signe suffit. Notez l’heure du début.', il: 'call', no: ['boire', 'manger'] }
  ]},
  { id: 'conv', nom: 'Convulsions', signe: 'Secousses, ne répond plus', steps: [
    { t: 'Protégez sa tête', x: 'Un vêtement plié dessous. Écartez ce qui peut la blesser.' },
    { t: 'Ne la retenez pas', x: 'Laissez la crise passer.', no: ['tenir', 'rien dans la bouche'] },
    { t: 'Chronométrez', x: 'Plus de 5 minutes, ou crises qui se suivent : appelez le 15.', il: 'call' },
    { t: 'Après la crise', x: 'Mettez-la sur le côté et restez près d’elle.', il: 'pls' }
  ]},
  { id: 'mal', nom: 'Malaise', signe: 'Douleur, pâleur, sueurs', steps: [
    { t: 'Mettez-la au repos', x: 'Assise ou allongée, comme elle se sent le mieux.' },
    { t: 'Posez 3 questions', x: 'Depuis quand ? Douleur dans la poitrine ? Maladie ou traitement ?' },
    { t: 'Appelez le 15', x: 'Répétez ses réponses au médecin. Suivez ses conseils.', il: 'call' },
    { t: 'Restez avec elle', x: 'Si elle ne répond plus et ne respire plus : arrêt cardiaque.' }
  ]}
];
window.URG_BY_ID = Object.fromEntries(window.URG.map(u => [u.id, u]));
