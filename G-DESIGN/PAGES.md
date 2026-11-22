# PAGES.md — Premier Geste (app de premiers secours)

Produit : une app qui guide un témoin, pas à pas, pendant une urgence.
Chaque geste = **image** (illustration du geste) + **texte** (consigne courte
+ détail) + **audio** (consigne lue à voix haute, mains libres).
Format : app téléphone (demande explicite de H : « une app »), cadres 390×844.

| # | Page | Rôle | Contenu clé | Statut |
|---|---|---|---|---|
| 1 | **Guide pas à pas** (page principale) | Faire le geste juste, mains libres | Illustration du geste, titre d'étape, consigne, bouton Écouter (audio), lecture auto, étapes précédente/suivante, métronome 110/min pour le massage, appel 15 toujours visible | **3 directions — en revue** |
| 2 | Accueil « Quelle urgence ? » | Choisir en 2 s | 8 tuiles illustrées (arrêt cardiaque, étouffement, hémorragie, inconscient qui respire, brûlure, AVC, convulsions, malaise), boutons 15 / 112 / 114 | à dessiner (après style) |
| 3 | Appel des secours | Savoir quoi dire | Numéros 15 / 18 / 112 / 114 (SMS), script « qui, où, quoi », position GPS lisible | à dessiner |
| 4 | Fiches (hors urgence) | Apprendre à froid | Liste des 8 fiches, lecture complète, rappel « ne remplace pas une formation PSC1 » | à dessiner |

Les 8 urgences et leurs étapes : `planches/shared/data.js` (source unique du
contenu texte + audio). Contenu à faire relire par un formateur PSC1 avant
toute diffusion publique.
