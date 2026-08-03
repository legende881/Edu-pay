---
description: 
---

Refonte Visuelle de l'Application (Uniformisation)
Ce plan vise à appliquer l'esthétique, les formes et les couleurs de la page "Liste des Familles" (design épuré, fond blanc, bordures fines, ombres légères) à l'ensemble des autres pages de l'application (Dashboard, Parent Dashboard, Pages de connexion et d'inscription) afin de garantir une parfaite uniformité visuelle.

User Review Required
IMPORTANT

Les modifications suivantes vont supprimer les dégradés complexes (gradients verts et oranges) et le "glassmorphism" (effets de verre transparent) actuellement utilisés sur le tableau de bord principal. Le design deviendra plus minimaliste et plat (flat design), en accord avec la vue "Liste des Familles". Êtes-vous d'accord avec cette approche "Flat Design" globale ?

Proposed Changes
Styles Globaux
[MODIFY] src/index.css
Création d'une nouvelle classe .app-card calquée sur .student-card :
css

.app-card {
  background: var(--bg-card); 
  border-radius: var(--radius-lg); 
  border: 1px solid var(--border-light); 
  padding: 24px; 
  box-shadow: var(--shadow-sm); 
  transition: transform 0.2s, box-shadow 0.2s;
}
.app-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
Suppression/Remplacement des classes premium-card, glass-stat-card, success-gradient, warning-gradient, card-glass par la nouvelle approche épurée.
Uniformisation des formulaires et des pages de login (.card remplacé par .app-card).
Composants et Pages
[MODIFY] src/pages/dashboard.jsx
Remplacement des cartes financières à dégradés par des cartes standards .app-card.
Retrait des conteneurs .card-glass superflus.
Adaptation des grilles (.premium-financial-grid, .secondary-grid) pour utiliser le même espacement que .students-grid.
Uniformisation des blocs "Paramètres" pour utiliser le style standard.
[MODIFY] src/pages/parent-dashboard.jsx
Remplacement des cartes d'étudiants premium-card par .app-card.
Uniformisation des fenêtres de dialogue (modals) et des encarts de paiement pour utiliser le style standard (bordures grises fines au lieu d'encarts colorés).
[MODIFY] src/pages/login.jsx
[MODIFY] src/pages/login-parent.jsx
[MODIFY] src/pages/register-director.jsx
Utilisation de la nouvelle classe .app-card au lieu de .card.
Harmonisation des marges et des rayons de bordures (border-radius) pour qu'ils soient identiques à ceux de la liste des familles.
Verification Plan
Manual Verification
Naviguer sur le Dashboard Directeur, le Dashboard Parent, et les pages de connexion.
Vérifier que les cartes, les ombres, les bordures et les couleurs sont strictement identiques à celles de l'onglet "Liste des familles".
S'assurer de la bonne lisibilité et de l'aspect premium épuré.