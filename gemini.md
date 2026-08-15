# EduPay - Projet SaaS de Gestion Scolaire

## 1. Description du Projet (Ce que l'application fait)
EduPay est une application web (SaaS) conÃ§ue pour la gestion administrative, financiÃ¨re et pÃ©dagogique des Ã©tablissements scolaires. Elle offre des tableaux de bord spÃ©cifiques pour diffÃ©rents rÃ´les (Directeur, Parents, Enseignants) afin de fluidifier la communication, centraliser les paiements (scolaritÃ©s) et simplifier le suivi acadÃ©mique (notes, bulletins).

## 2. FonctionnalitÃ©s ImplÃ©mentÃ©es

### Espace Directeur (Admin)
- **Tableau de bord (Vue d'ensemble) :** Statistiques globales (Total Ã©lÃ¨ves, Taux de recouvrement, Paiements du jour).
- **Gestion des Familles et Ã‰lÃ¨ves (`students.jsx`) :** Ajout de familles, affectation d'Ã©lÃ¨ves Ã  une classe, gÃ©nÃ©ration de reÃ§us de paiement (PDF) et partage via WhatsApp. Les dossiers familles sont triÃ©s automatiquement par ordre alphabÃ©tique.
- **Gestion des Paiements (`payments.jsx`) :** Un tableau de bord SaaS dÃ©taillÃ© pour suivre les paiements (Montant recouvrÃ©, Reste Ã  recouvrer, Taux). Filtres interactifs (Tous, SoldÃ©s, Partiels, ImpayÃ©s). Liste triÃ©e alphabÃ©tiquement.
- **Gestion des Enseignants (`SettingsTeachers` dans `dashboard.jsx`) :** CrÃ©ation des profils professeurs, affectation aux classes/matiÃ¨res/jours/heures de cours, gÃ©nÃ©ration de liens d'accÃ¨s, et vue triÃ©e par ordre alphabÃ©tique.
- **ParamÃ©trages globaux :** Configuration des tranches de paiement, informations de contact (WhatsApp, Tmoney, Flooz), et configuration du compte directeur.
- **ParamÃ©trage des Bulletins (`SettingsBulletin`) :** DÃ©finition des matiÃ¨res, coefficients, et barÃ¨mes d'Ã©valuation.

### Espace Parent (`parent-dashboard.jsx`)
- **Visualisation des enfants :** AccÃ¨s aux dossiers des enfants inscrits.
- **Suivi financier :** Consultation de la scolaritÃ© totale, des paiements effectuÃ©s, et du reste Ã  payer.
- **Bulletins de notes :** Bouton pour consulter/tÃ©lÃ©charger le bulletin de l'Ã©lÃ¨ve (qui s'affiche dans un modal propre, prÃªt Ã  l'impression, avec l'en-tÃªte de l'Ã©cole et la devise).

### Espace Enseignant (`teacher-dashboard.jsx`)
- **Vue d'ensemble :** Consultation des classes et matiÃ¨res affectées.
- **Saisie des notes :** Interface pour remplir les notes des élèves, ajouter des appréciations et enregistrer l'évaluation.
- **Saisie dynamique des devoirs :** L'interface de saisie s'adapte à la classe (Collège vs Lycée). Pour le Collège, l'enseignant saisit 3 notes de devoirs distinctes (Devoir 1, Devoir 2, Devoir 3) dont la moyenne est calculée automatiquement. La note d'interrogation est masquée pour correspondre au format du bulletin Collège. Pour le Lycée, les champs habituels (Int, Dev, Comp) sont conservés.

### Authentification & AccÃ¨s
- Pages de connexion dÃ©diÃ©es (Directeur, Parent, Enseignant).
- Redirection basÃ©e sur le rÃ´le simulÃ©e et stockÃ©e via le `localStorage`.

## 3. Technologies UtilisÃ©es
- **Core :** React.js, Vite.
- **Styling :** CSS Vanilla moderne (`index.css`) respectant une approche "Flat Design" trÃ¨s Ã©purÃ©e (retrait des effets glassmorphism et gradients complexes pour privilÃ©gier un fond blanc, des bordures fines et un aspect premium minimaliste).
- **IcÃ´nes :** Lucide React.
- **Génération PDF :** jspdf et jspdf-autotable (utilisés pour les reçus de paiement et les bulletins).
- **State Management & Base de données :** React Hooks (`useState`, `useEffect`, `useMemo`) + **Supabase** (PostgreSQL, Authentification) pour persister la donnée de façon permanente. L'ancienne version sur `localStorage` a été migrée vers une architecture Fullstack.
- **Routing :** React Router DOM.
- **PWA (Progressive Web App) :** Intégration de `vite-plugin-pwa` pour permettre l'installation de l'application sur mobile Android sans passer par le Play Store.
- **Téléchargements (Windows & Android) :** Ajout de boutons de téléchargement stylisés (avec logos officiels) pour l'exécutable Windows (`.exe`) et l'application Android (`.apk`) directement sur la page de connexion.

## 4. Structure des Fichiers

```text
Edu-pay/
â”œâ”€â”€ package.json
â”œâ”€â”€ index.html
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ main.jsx                 # Point d'entrÃ©e React
â”‚   â”œâ”€â”€ App.jsx                  # Routeur principal de l'application
â”‚   â”œâ”€â”€ index.css                # Styles globaux (Design System Flat Design)
â”‚   â”œâ”€â”€ supabaseClient.js        # Client Supabase (Connexion DB/Auth)
â”‚   â”œâ”€â”€ supabaseService.js       # Services CRUD de manipulation des donnÃ©es (Familles, Ã‰lÃ¨ves, Paiements)
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ AddStudentModal.jsx  # Formulaire d'ajout de famille/Ã©lÃ¨ve
â”‚   â”‚   â””â”€â”€ BulletinModal.jsx    # Affichage A4 du bulletin avec boutons externes
â”‚   â”œâ”€â”€ pages/
â”‚   â”‚   â”œâ”€â”€ login.jsx            # Connexion Administrateur/Directeur
â”‚   â”‚   â”œâ”€â”€ login-parent.jsx     # Connexion Parent
â”‚   â”‚   â”œâ”€â”€ login-teacher.jsx    # Connexion Enseignant
â”‚   â”‚   â”œâ”€â”€ register-director.jsx# Inscription Directeur
â”‚   â”‚   â”œâ”€â”€ dashboard.jsx        # Espace Directeur (Contient divers sous-onglets Settings)
â”‚   â”‚   â”œâ”€â”€ students.jsx         # Gestion des Familles et Ã©lÃ¨ves (Sous-onglet Directeur)
â”‚   â”‚   â”œâ”€â”€ payments.jsx         # Tableau de bord SaaS des paiements
â”‚   â”‚   â”œâ”€â”€ parent-dashboard.jsx # Espace Parent
â”‚   â”‚   â””â”€â”€ teacher-dashboard.jsx# Espace Enseignant
```

## 5. Décisions de Design & Architecture (Important pour les prochains Modèles IA)
- **Flat Design Obligatoire :** Toute l'UI de l'application a été uniformisée. Plus aucun dégradé complexe ni effet "glassmorphism". Utiliser la classe `.app-card` définie dans `index.css` (fond blanc, bordure fine grise, léger box-shadow au survol) pour tous les conteneurs et cartes.
- **Routage :** Les espaces (Directeur, Parent, Enseignant) sont très séparés. Un composant/page distinct(e) pour chaque type d'utilisateur.
- **Ordre Alphabétique :** Il a été explicitement défini que TOUTES les listes affichant des noms (familles, enseignants, élèves dans l'onglet paiements) doivent être strictement triées de façon croissante (de A à Z). Cela est géré à la volée avant le rendu avec `.sort((a,b) => a.name.localeCompare(b.name))`.
- **Composant Bulletin (`BulletinModal.jsx`) :** L'affichage du bulletin se fait sur une vue blanche A4. Les boutons d'action sont en dehors de la zone d'impression.
- **Bulletin Dynamique (Collège vs Lycée) :** Le modèle du bulletin change dynamiquement en fonction de la classe de l'élève (`student.grade`). 
  - *Collège (6ème à 3ème) :* Bulletin au format **Portrait**, colonnes `1, 2, 3 (Devoirs)`. Les matières Philosophie, Allemand et Espagnol sont automatiquement masquées.
  - Le modèle Collège intègre des lignes de sous-totaux par groupe de matières, une ligne `Totaux` globale en bas de tableau, et un pied de page complexe à 4 colonnes calqué exactement sur le modèle physique (Retards, Félicitations, Décisions du conseil, etc.).
  - *Lycée (Seconde à Terminale) :* Ancien modèle au format **Paysage**, colonnes `Int, Dev, Comp`.
  - La distinction s'effectue via la méthode `isCollege(grade)`.
- **Observations Automatiques :** Dans les bulletins, les appréciations ("Faible", "Insuffisant", "Passable", "Assez-Bien", "Bien", "Très Bien") sont générées automatiquement en fonction de la moyenne générale de chaque matière, remplaçant ainsi les anciennes cases à cocher manuelles.

---
**Note de passation pour le Modèle IA Suivant :**  
Utilisez ce fichier comme source de vérité pour comprendre le contexte global du projet. Référez-vous systématiquement aux décisions de design (Flat Design), à la logique de structure existante, et aux règles de tri (Alphabétique de A à Z) pour maintenir la cohérence de l'application lors de vos futurs développements.

**Règle absolue d'auto-mise à jour :**
À chaque fois que vous apportez des modifications significatives au code, à l'architecture ou au design, vous avez l'OBLIGATION de mettre à jour ce fichier (`gemini.md`) pour y refléter ces nouveautés. Cela garantit que la documentation reste toujours en synchronisation parfaite avec l'état actuel du code. Ne demandez pas la permission à l'utilisateur, faites-le systématiquement à la fin de vos modifications !

### Historique des Transactions (Nouveauté)
- **Table `transactions` :** Une nouvelle table a été créée dans Supabase pour historiser chaque paiement avec sa date exacte (`id`, `payment_id`, `student_id`, `amount`, `date`). Une colonne `recorded_by` a été ajoutée pour suivre la trace de la personne (directeur ou administrateur) ayant enregistré le paiement.
- **Calendrier des paiements :** Le tableau de bord permet désormais de filtrer les transactions par date via un calendrier, grâce à l'enregistrement précis de l'historique au lieu de l'écrasement des montants précédents.
- **Détails des Paiements (`payments.jsx`) :** Un bouton "Détails" permet désormais d'ouvrir un modal pour chaque élève. Il affiche les informations de l'élève, de ses parents, un résumé financier, et l'historique complet de toutes ses transactions, incluant l'adresse email de la personne qui les a encaissées.

### Gestion de l'Abonnement Premium (Nouveauté)
- **Essai Gratuit de 30 Jours :** Le système tracke la date de première connexion via la table `global_settings` (ID = 3).
- **Chronomètre :** Un badge affiche le temps restant d'essai gratuit en haut du tableau de bord (`dashboard.jsx`).
- **Blocage (Paywall) :** Après 30 jours, un popup modale s'affiche au bout de 5 secondes, floutant et bloquant l'application jusqu'à souscription au Premium.
- **Simulation Paiement Mobile Money :** Une interface simulant FedaPay/Paystack a été intégrée pour "payer" (TMoney/Flooz) et débloquer automatiquement le compte (en passant `isPremium = true`).

### Refonte Flat Design (Nouveauté)
- **Uniformisation :** L'approche visuelle "Flat Design" (fond blanc, bordures fines, suppression des dégradés complexes et du glassmorphism) a été appliquée rigoureusement à l'intégralité de l'application.
- **Fichiers Modifiés :** `dashboard.jsx` (cartes financières, statistiques), `parent-dashboard.jsx` (cartes étudiants, encarts de paiement), ainsi que les différentes pages de connexion. Les classes `premium-card`, `success-gradient`, `warning-gradient` et `card-glass` ont été remplacées par la classe utilitaire globale `.app-card` et `.students-grid`.