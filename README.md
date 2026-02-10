# ProjetSpaceShooter

## Travail réalisé au cours du temps (Voir commits pour plus de détails)

Début : utilisation de bouts de code de Monsieur Buffa pour le js, je commence a crée la première page, la structure du jeu et le style. Petites difficultés sur l'usage de canva et de tous les liens entre les classes car on l'a seulement vu en CM pour le moment.

J'ajoute les mouvement et les tirs, mais pas d'enemis pour le moment 

Ajout des enemis, collisions, vies scores et explosions (phase de jeu presque complète)

Ajout des différents niveaux, boss en cours

Aide de l'IA sur les formules de maths (deplacement collisions etc), utilisation pour la génération de l'explosion et pour les images, je m'en suis aussi servi au départ pour canva.

Gestion de la victoire / défaite, victoire nécessaire pour passer au niveau suivant.

Gestion des scores et des niveaux débloqués (local storage, vu avec monsieur Othmane)

Amélioration de l'affichage notemment en jeu.

Ajout de commentaires, prochaine étape potentielle : gros refactor et organisation des fichiers pour plus de clarté

Améliorations possibles dans le futur : ajout de plus de sorte d'enemis (astéroides par exemple ne donnants pas de points)

Ajout du système de **Bonus** :
- **Bonus de Charge** : Orbes jaunes, rapportent 500 points et chargent une barre spéciale. 3 charges débloquent un **Rayon Laser** dévastateur pendant 5 secondes.
- **Bonus de Bouclier** : Orbes verts marqués "S", offrent une invulnérabilité totale de 3 secondes. Les ennemis touchés sous bouclier sont détruits.

Amélioration visuelle :
- Ajout d'un **fond étoilé procédural** avec effet de parallaxe pour une sensation de vitesse.
- Le Rayon Laser est maintenant un faisceau continu traversant tout l'écran.
- Ajustement de la difficulté et de la durée des niveaux.

## Documentation Technique

### Architecture du Projet
Le projet est structuré autour d'un fichier principal `script.js` qui gère la boucle de jeu et l'état global, et de plusieurs classes modules pour les entités du jeu.

### Détail des Fichiers et Fonctions

#### 1. `script.js` (Contrôleur Principal)
C'est le point d'entrée et le cœur du jeu. Il gère l'initialisation, le rendu, la logique de jeu, et les interactions utilisateur.
- **`init()`** : Initialise le canvas, les écouteurs d'événements, gère le menu principal et le déverrouillage des niveaux via `localStorage`.
- **`startGame(level)`** : Lance une partie au niveau spécifié. Réinitialise les variables de jeu (score, entités) et configure les vagues d'ennemis ou le boss via des `setTimeout`.
- **`mainLoop()`** : La boucle de jeu principale, appelée récursivement via `requestAnimationFrame`. Efface le canvas et appelle `updateGame` et `drawGame` si le jeu est en cours.
- **`updateGame()`** : Met à jour toute la logique du jeu à chaque frame :
  - Déplacements du joueur et gestion des limites de l'écran.
  - Gestion des tirs du joueur (création et déplacement).
  - Gestion des ennemis et du boss (déplacement, tirs).
  - **Gestion des collisions** : Vérifie les interactions entre lasers, joueur, ennemis et boss. Gère les dégâts, les scores et les explosions.
  - Vérifie les conditions de victoire pour les niveaux 1 et 2 (tous les ennemis vaincus).
- **`drawGame()`** : Dessine tous les éléments graphiques sur le canvas : joueur, ennemis, lasers, explosions, boss et barre de vie.
- **`gameOver()`** : Affiche l'écran de défaite et le score final.
- **`win()`** : Affiche l'écran de victoire, sauvegarde le score et débloque le niveau suivant.
- **`updateScore()` / `updateLevel()`** : Met à jour l'affichage du HUD et sauvegarde les données en `localStorage`.

#### 2. `ecouteurs.js` (Gestion des Entrées)
Gère les interactions clavier.
- **`defineListeners()`** : Ajoute des écouteurs sur `keydown` et `keyup` pour suivre l'état des touches (Flèches directionnelles, Espace).
- **`inputStates`** : Objet exporté stockant l'état actuel des touches pour une utilisation fluide dans la boucle de jeu.

#### 3. `objet.js` (Classe Mère)
Classe de base pour toutes les entités visuelles du jeu.
- **`constructor(x, y, couleur, largeur, hauteur)`** : Initialise la position et les dimensions.
- **`draw(ctx)`** : Méthode générique de dessin (souvent surchargée par les classes filles).

#### 4. `player.js` (Classe Joueur)
Hérite de `objet`. Représente le vaisseau du joueur.
- **`constructor(...)`** : Charge l'image du vaisseau et initialise les vies (3).
- **`updateLife()`** : Met à jour l'affichage des cœurs dans le HUD.
- **`draw(ctx)`** : Affiche le vaisseau avec rotation et translation.

#### 5. `boss.js` (Classe Boss)
Hérite de `objet`. Gère le comportement unique du boss de fin (Niveau 3).
- **`move(canvasWidth)`** : Gère le déplacement complexe du boss (descente puis va-et-vient horizontal).
- **`shoot()`** : Génère un motif de tir en éventail (5 lasers) à intervalles réguliers.
- **`lifeBar(ctx)`** : Dessine la barre de vie du boss de manière statique en haut de l'écran.

#### 6. `enemis.js` (Classe Ennemis)
Hérite de `objet`. Gère les ennemis standards.
- **`move()`** : Déplace l'ennemi vers le bas.
- **`draw(ctx)`** : Affiche l'ennemi (image ou rectangle selon chargement).

#### 7. `laser.js` (Classe Projectiles)
Hérite de `objet`. Gère les tirs du joueur et du boss.
- **`constructor(..., vy, vx)`** : Permet de définir une vitesse verticale et horizontale personnalisée (utile pour les tirs du boss).
- **`move()`** : Met à jour la position du laser.

#### 8. `explosion.js` (Effets Visuels)
Gère les particules d'explosion.
- **`constructor(x, y, color)`** : Crée un système de particules. Si la couleur est "red" (Boss/Joueur), génère une explosion plus massive.
- **`update()`** : Met à jour la position et la transparence des particules.
- **`draw(ctx)`** : Dessine les particules avec effet de transparence.

#### 9. `bonus.js` (Classe Bonus)
Hérite de `objet`. Gère les items ramassables.
- **`type`** : "charge" (jaune) ou "shield" (vert).
- **`draw(ctx)`** : Dessine une orbe brillante avec un symbole (+ ou S).
- **`move()`** : Déplace le bonus vers le bas.

### Mécaniques Spéciales
- **Fond Étoilé** : Géré directement dans `script.js` via `initStars()`, `updateStars()` et `drawStars()` pour un effet de défilement fluide.
- **Rayon Laser** : Une fois la barre de bonus pleine (3 charges), le joueur tire un rayon continu (dessiné via `fillRect`) qui traverse l'écran et inflige des dégâts constants.
- **Bouclier** : Géré par l'état `shieldActive` du joueur. Période d'invulnérabilité où les collisions avec les ennemis sont bénéfiques.

