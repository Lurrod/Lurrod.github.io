# Portfolio de Titouan Borde

Bienvenue sur mon portfolio ! Ce site web présente mes projets, compétences et certifications en tant que développeur web. Il a été conçu pour être à la fois esthétique et fonctionnel, avec des animations interactives et une interface utilisateur intuitive.

## 🚀 Fonctionnalités

- **Thème clair/sombre** : Basculez entre un thème clair et sombre pour un confort visuel personnalisé.
- **Effets de machine à écrire** : Animation de texte pour le titre principal.
- **Effet de glitch** : Animation de glitch pour le sous-titre.
- **Projets interactifs** : Cliquez sur les cartes de projet pour voir une description détaillée, les compétences utilisées, et des liens vers GitHub et le site en direct.
- **Section de compétences** : Affiche mes compétences techniques avec des icônes et des animations au survol.
- **Section de contact** : Formulaire de contact relié à une petite API Node (`server/`) qui transmet chaque message par email à contact@titouan-borde.com.
- **Certifications** : Téléchargez mes certifications directement depuis le site.
- **Responsive Design** : Le site est entièrement responsive et s'adapte à tous les appareils (ordinateurs, tablettes, mobiles).

## 🛠 Technologies utilisées

- **HTML5** : Structure du site.
- **CSS3** : Styles et animations.
- **JavaScript** : Interactivité et effets dynamiques.
- **Node.js / Express + Nodemailer** : API du formulaire de contact (validation, anti-spam, limite d'envoi), SMTP OVH.
- **Font Awesome** : Icônes utilisées dans tout le site.
- **Google Fonts** : Polices personnalisées pour une meilleure typographie.

## 📂 Structure du projet

- **index.html** : Page principale du portfolio.
- **style.css** : Feuille de style pour le design et les animations.
- **script.js** : Script JavaScript pour les fonctionnalités interactives.
- **images/** : Dossier contenant les images utilisées dans le projet (prévisualisations des projets, icônes, etc.).
- **server/** : API du formulaire de contact (`npm test` pour la suite de tests, `.env.example` pour la configuration).
- **.github/workflows/deploy.yml** : CI/CD — tests de l'API puis déploiement sur le serveur à chaque push sur `main`.
- **README.md** : Ce fichier, qui explique le projet.

## 🚢 Déploiement

Le site est servi par Apache depuis `/var/www/titouan-borde.com`, qui est un clone de ce dépôt. À chaque push sur `main`, GitHub Actions lance les tests de `server/`, puis se connecte en SSH au serveur : `git reset --hard origin/main`, `npm ci`, redémarrage PM2 du process `portfolio-api` (port 3400, exposé via `ProxyPass /api/`), et enfin des smoke tests.

- Secrets GitHub : `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`.
- Secrets de l'API : `/home/ubuntu/portfolio-api/.env` sur le serveur (hors du dossier servi).
- `lurrod.github.io` redirige vers `titouan-borde.com`.

## 🎨 Design

Le design du portfolio est moderne et épuré, avec des couleurs dynamiques qui changent en fonction du thème (clair ou sombre). Les animations ajoutent une touche interactive, comme l'effet de machine à écrire pour le titre et l'effet de glitch pour le sous-titre.
