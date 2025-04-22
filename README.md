Ruche Connectée

Ruche Connectée est une application mobile multiplateforme (iOS & Android) développée en React Native pour permettre aux apiculteurs de surveiller à distance l’état de leurs ruches (poids, température, humidité) via le réseau Sigfox et Adafruit IO.

🎯 Objectifs du projet

Suivi en temps réel des mesures de la ruche (jusqu’à 3 envois Sigfox/jour)

Affichage graphique dynamique des données (courbes poids/température/humidité)

Système d’alerte par notification push en cas de seuil critique

Décodage des payloads Sigfox (hexadécimal big‑endian) en données exploitables

📁 Structure du dépôt

Ruche/
├── data/               # DONNÉES LOCALES (IGNORÉ POUR LA SÉCURITÉ)
├── data/DataGetter.js  # Module de récupération et décodage des données Adafruit IO
├── .env                # Variables d’environnement (clé Adafruit, utilisateur)
├── package.json        # Dépendances et scripts npm
├── .gitignore          # Fichiers et dossiers exclus du suivi Git
└── README.md           # Documentation du projet

Sécurité : Le dossier data/ est volontairement ignoré dans .gitignore car il peut contenir des fichiers JSON ou des logs locaux avec des clés d’API ou des informations sensibles. Cette mesure empêche toute fuite accidentelle de secrets.

⚙️ Installation

Cloner le projet

git clone https://github.com/Mehdi-Lahouir/Ruche.git
cd Ruche

Installer les dépendances

npm install

Créer le fichier .env à la racine avec :

ADAFRUIT_IO_KEY=<votre_clé_Adafruit_IO>
ADAFRUIT_IO_USERNAME=<votre_utilisateur>

Vérifier que data/ et .env sont listés dans .gitignore.

🚀 Utilisation

Lancer en CLI (pour test ou débogage) :

node data/DataGetter.js

Cela affiche en JSON les enregistrements de poids décodés par dispositif.

Intégration dans une autre application :

import { fetchData } from './data/DataGetter.js';

(async () => {
  const result = await fetchData();
  console.log(result);
})();

🛠️ Technologies utilisées

React Native : UI mobile cross‑platform

Sigfox : réseau IoT basse consommation pour l’envoi de payloads

Adafruit IO : plateforme de flux de données (REST API)

dotenv : chargement des variables d’environnement

node-fetch (optionnel) : polyfill fetch en Node.js

✨ Équipe & Encadrement

Lahouir Mehdi : décodage Sigfox, intégration Adafruit IO

Benabbou Mohamed Amine : interface graphique et graphiques dynamiques

Bouachrine Ahmed Reda : notifications push et logique de seuils

El Moudden Walid : coordination, rédaction, conception générale

Encadrant : M. Philippe GHEERAERT

Année scolaire : 2024/2025

🔒 Sécurité & bonnes pratiques

Ne jamais committer de clés d’API : utilisez toujours un fichier .env ignoré.

Ignorer le dossier data/ pour éviter l’exfiltration de logs ou données brutes.

En production, stockez les secrets dans un gestionnaire sécurisé (GitHub Secrets, Vault, etc.).

🤝 Contribution

Les contributions sont les bienvenues : ouvrez une issue ou un pull request sur GitHub.
