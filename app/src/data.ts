/* First Aid — content for the 8 emergencies (single source for text + audio).
   t = step title (displayed + spoken), x = instruction (displayed + spoken),
   il = illustration (defaults to the emergency's own), metro = 110 bpm metronome,
   no = actions to AVOID (shown crossed out).
   Content aligned with French public first-aid guidance
   (lifesaving gestures / PSC1) — to be reviewed by a trainer. */
export interface Step { t: string; x: string; il?: string; metro?: boolean; no?: string[] }
export interface Urgency { id: string; nom: string; signe: string; steps: Step[] }

export const URG: Urgency[] = [
  { id: 'rcp', nom: 'Cardiac arrest', signe: 'Not responding, not breathing', steps: [
    { t: 'Call 15', x: 'Put the phone on speaker. Have someone fetch a defibrillator.', il: 'call' },
    { t: 'Lay them on their back', x: 'On a firm surface. Kneel beside their chest.' },
    { t: 'Push hard and fast', x: 'Hands in the centre of the chest, arms straight. Press down 5 cm, in time with the beep.', metro: true },
    { t: 'The defibrillator arrives', x: 'Turn it on and follow its voice prompts. Stop compressions only when it tells you to.', il: 'dae' },
    { t: 'Do not stop', x: 'Continue until help arrives or they start breathing again.', metro: true }
  ]},
  { id: 'etouf', nom: 'Choking', signe: 'Cannot speak or cough', steps: [
    { t: 'Are they coughing?', x: 'Encourage them to cough. Do not slap their back while they are coughing.' },
    { t: '5 back slaps', x: 'Lean them forward. Strike firmly between the shoulder blades with the heel of your hand.', il: 'dos' },
    { t: '5 abdominal thrusts', x: 'Stand behind them, fist in the upper abdomen. Pull firmly inward and upward.' },
    { t: 'Alternate 5 and 5', x: 'Until the object comes out. If they become unconscious: call 15 and start CPR.' }
  ]},
  { id: 'hemo', nom: 'Severe bleeding', signe: 'Blood is flowing heavily', steps: [
    { t: 'Press hard on the wound', x: 'With a clean cloth, or your hand protected by a glove or a plastic bag.' },
    { t: 'Lay them down', x: 'Keep steady pressure without letting go, even to check.' },
    { t: 'Have someone call 15', x: 'Do not let go of the wound. Give the exact address.', il: 'call' },
    { t: 'Cover them', x: 'Keep them warm. Talk to them and check that they respond.' }
  ]},
  { id: 'pls', nom: 'Unconscious but breathing', signe: 'Not responding but breathing', steps: [
    { t: 'Are they breathing?', x: 'Watch their abdomen and chest rise for 10 seconds.' },
    { t: 'Roll them onto their side', x: 'Near arm at a right angle, their other hand against their cheek, opposite knee bent: roll them toward you.' },
    { t: 'Mouth toward the ground', x: 'Head tilted slightly back, mouth open, so they can breathe freely.' },
    { t: 'Call 15', x: 'Then keep checking their breathing until help arrives.', il: 'call' }
  ]},
  { id: 'brul', nom: 'Burn', signe: 'Red skin, blister, pain', steps: [
    { t: 'Cool it immediately', x: 'With lukewarm water, for at least 10 minutes.' },
    { t: 'Remove tight items', x: 'Rings, watch, clothing around the area. Except anything stuck to the skin.' },
    { t: 'Severe? Call 15', x: 'Larger than their palm, blistered, or on the face, hands or neck: call.', il: 'call' },
    { t: 'Put nothing on it', x: 'Do not burst blisters.', no: ['ice', 'butter', 'toothpaste'] }
  ]},
  { id: 'avc', nom: 'Stroke', signe: 'Face, arm, speech: FAST', steps: [
    { t: 'Check their face', x: 'Ask them to smile: does one side of the mouth droop?' },
    { t: 'Check one arm', x: 'Ask them to raise both arms: does one fall back down?' },
    { t: 'Check their speech', x: 'Ask them to repeat a simple sentence: are their words slurred?' },
    { t: 'Call 15 urgently', x: 'One sign is enough. Note the time it started.', il: 'call', no: ['drink', 'eat'] }
  ]},
  { id: 'conv', nom: 'Seizures', signe: 'Shaking, no longer responding', steps: [
    { t: 'Protect their head', x: 'Place a folded garment underneath. Move away anything that could hurt them.' },
    { t: 'Do not hold them down', x: 'Let the seizure pass.', no: ['hold them down', 'put anything in their mouth'] },
    { t: 'Time the seizure', x: 'Over 5 minutes, or repeated seizures: call 15.', il: 'call' },
    { t: 'After the seizure', x: 'Roll them onto their side and stay with them.', il: 'pls' }
  ]},
  { id: 'mal', nom: 'Sudden illness', signe: 'Pain, paleness, sweating', steps: [
    { t: 'Let them rest', x: 'Sitting or lying down, whichever feels best for them.' },
    { t: 'Ask 3 questions', x: 'Since when? Chest pain? Any illness or medication?' },
    { t: 'Call 15', x: 'Repeat their answers to the doctor. Follow their advice.', il: 'call' },
    { t: 'Stay with them', x: 'If they stop responding and breathing: cardiac arrest.' }
  ]}
];

export const URG_BY_ID: Record<string, Urgency> = Object.fromEntries(URG.map(u => [u.id, u]));
