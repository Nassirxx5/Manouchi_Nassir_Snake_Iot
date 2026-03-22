# Manouchi_Nassir_Snake_IoT

## 📝 Nom et description du projet
**Snake IoT Edition** est une revisite moderne du célèbre jeu d'arcade "Snake". 
L'originalité de ce projet réside dans son système de contrôle : le jeu peut être joué au clavier de manière classique, mais il intègre également une communication matérielle via l'API Web Serial. Cela permet de piloter le serpent à l'aide d'un joystick analogique connecté à un microcontrôleur Arduino Nano, fusionnant ainsi le développement web front-end et l'électronique embarquée (IoT).

## 🛠 Technologies utilisées
- **HTML5 (Canvas) :** Pour la structure de la page et la zone de rendu 2D du jeu.
- **CSS3 :** Pour le design "Rétro-Néon" (effets de glow, Flexbox pour la responsivité).
- **JavaScript (Vanilla) :** Pour la logique du jeu (Game Loop, collisions) et la gestion des scores (`localStorage`).
- **C++ (Arduino) :** Pour le code embarqué lisant les valeurs du joystick.
- **Web Serial API :** Pour la communication bidirectionnelle en temps réel entre le navigateur web et le port USB de l'Arduino.

## ✨ Fonctionnalités principales
- Contrôle matériel via un joystick physique (Arduino Nano) ou via les flèches du clavier.
- Moteur de jeu fluide utilisant `requestAnimationFrame` pour une gestion précise du temps.
- Sauvegarde persistante du meilleur score (High Score) directement dans le navigateur.
- Interface utilisateur interactive avec retour visuel de la connexion matérielle.
- Protection anti-demi-tour pour éviter le "suicide" accidentel du serpent.

## 🔗 Lien vers la page GitHub Pages (Rendu final)
https://Nassirxx5.github.io/Manouchi_Nassir_Snake_Iot/


*(Note : Pour tester la fonctionnalité Arduino, il est nécessaire d'utiliser un navigateur compatible avec l'API Web Serial comme Google Chrome ou Microsoft Edge).*

## 🧠 Nouveautés explorées
Durant ce projet, j'ai particulièrement exploré :
1. **L'API Canvas :** Comprendre comment dessiner, effacer et rafraîchir dynamiquement des éléments 2D (le serpent et la nourriture).
2. **L'API Web Serial :** Découverte de cette technologie récente permettant à une simple page web de communiquer avec des périphériques matériels sans passer par un serveur intermédiaire.
3. **La Boucle de jeu (Game Loop) :** Utilisation de `requestAnimationFrame` et calcul du "Delta Time" pour s'assurer que le jeu tourne à la même vitesse peu importe la puissance de l'ordinateur.

## 🚩 Difficultés rencontrées
1. **Verrouillage du port Série :** Lors de la connexion de l'Arduino, le navigateur renvoyait souvent une erreur `DOMException: The port is already open` si le bouton était cliqué deux fois ou si la page était mal rafraîchie.
2. **Logique de mouvement inverse :** Au début, le joueur pouvait appuyer sur "Bas" alors que le serpent allait vers le "Haut", ce qui provoquait une collision immédiate avec le propre corps du serpent.
3. **Spam de données série :** L'Arduino envoyait en permanence la position du joystick, ce qui saturait le navigateur et ralentissait le jeu.

## 💡 Solutions apportées
1. **Gestion des états de connexion :** Ajout d'une vérification en JavaScript (`if (serialPort && serialPort.readable)`) pour bloquer une nouvelle tentative de connexion si le port est déjà actif, et désactivation du bouton de connexion côté UI.
2. **Conditions anti-demi-tour :** Ajout de conditions strictes dans le code (ex: `if (command === 'U' && dy !== 1)`) pour ignorer la commande si elle est opposée à la direction actuelle de l'axe.
3. **Mémorisation d'état côté C++ :** Modification du code Arduino pour qu'il n'envoie la lettre de direction (`U`, `D`, `L`, `R`) que si la position du joystick a changé par rapport à la lecture précédente (utilisation d'une variable `lastCommand`).
