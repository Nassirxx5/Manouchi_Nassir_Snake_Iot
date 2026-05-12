# 🐍 Snake IoT Edition — Arcade Néon & Hardware

Bienvenue dans le projet **Snake IoT Edition**, une revisite moderne et interactive du célèbre jeu d'arcade. Ce projet fusionne le développement web front-end et l'électronique embarquée pour offrir une expérience de jeu hybride unique.

---

## 📝 Présentation du projet
L'originalité de ce projet réside dans son système de contrôle bidirectionnel. Si le jeu reste jouable au clavier, il prend tout son sens lorsqu'il est piloté par une **manette physique** (Joystick analogique) connectée à un microcontrôleur **Arduino Nano**. 

Le projet exploite l'**API Web Serial** pour permettre au navigateur de communiquer directement avec le matériel, créant ainsi un pont direct entre le code JavaScript et le monde physique.

---

## 🛠 Technologies utilisées

### **Web (Front-end)**
* **HTML5 (Canvas)** : Moteur de rendu 2D pour les graphismes du jeu.
* **CSS3** : Design "Retro-Neon" avec effets de lueur (glow) et mise en page responsive.
* **JavaScript (Vanilla)** : Logique de jeu (Game Loop), gestion des collisions et persistence des données (`localStorage`).
* **Web Serial API** : Communication série en temps réel via USB.
* **Web Audio API** : Intégration d'une signature sonore interactive (Audio UX).

### **Matériel (IoT)**
* **Arduino Nano / Uno** : Cerveau de la manette.
* **Joystick Analogique** : Pour le contrôle précis des directions.
* **Module LED RGB** : Pour le retour visuel physique (Feedback haptique).
* **C++ (Arduino)** : Gestion des entrées/sorties analogiques et numériques.

---

## ✨ Fonctionnalités principales

### 🎮 **Contrôles & Gameplay**
* **Hybride** : Jouez avec le joystick physique ou les flèches du clavier.
* **Fluidité** : Gestion du mouvement via `requestAnimationFrame` pour une expérience stable à 60 FPS.
* **Intelligence** : Système anti-demi-tour intégré pour éviter les collisions accidentelles.

### 🔊 **Expérience Immersive (Audio & Visual)**
* **Audio UX** : Bruitage personnalisé ("faa") lorsque le serpent mange et effet humoristique ("Laugh Cat") lors du Game Over.
* **Feedback LED RGB** :
    * 🔵 **Bleu** : Mode veille / En cours de jeu.
    * 🟢 **Flash Vert** : Retour visuel instantané lorsque le serpent mange une pomme.
    * 🔴 **Rouge** : Alerte visuelle de Game Over.

### 💾 **Système de Score**
* Sauvegarde automatique et persistante du **High Score** dans le navigateur.

---

## 🔗 Rendu final & Test
🚀 **Accéder au jeu en ligne :** [https://Nassirxx5.github.io/Manouchi_Nassir_Snake_Iot/](https://Nassirxx5.github.io/Manouchi_Nassir_Snake_Iot/)

> **Note :** La fonctionnalité de connexion Arduino nécessite un navigateur basé sur Chromium (Google Chrome, Microsoft Edge, Opera).

---

## 🔌 Montage Matériel (Hardware)

### **1. Brochage du Joystick**
| Joystick | Arduino |
| :--- | :--- |
| GND | GND |
| VCC | 5V |
| VRx | A0 |
| VRy | A1 |

### **2. Brochage de la LED RGB (Cathode Commune)**
| LED Pin | Arduino Pin |
| :--- | :--- |
| Rouge | D9 |
| Vert | D10 |
| Bleu | D11 |
| GND | GND |

---

## 🧠 Défis techniques & Apprentissages

Durant ce projet, j'ai particulièrement exploré :
1.  **Communication Bidirectionnelle** : Ce projet ne se contente pas de lire l'Arduino ; le navigateur lui renvoie des instructions pour piloter la LED RGB, créant un véritable écosystème IoT.
2.  **Gestion des flux (Streams)** : Utilisation des `TextEncoderStream` et `TextDecoderStream` pour transformer les signaux électriques en commandes logiques compréhensibles par le JavaScript.
3.  **Boucle de jeu synchrone** : Synchroniser le rafraîchissement de l'écran avec la lecture des données série sans ralentir le processeur.

---

## 💡 Solutions apportées
* **Verrouillage du port** : Ajout d'une sécurité logicielle pour empêcher l'ouverture multiple du port série (`serialPort.readable`).
* **Optimisation série** : Limitation de l'envoi de données depuis l'Arduino uniquement lors d'un changement d'état du joystick pour éviter la saturation du buffer.

---

**Développé avec passion par Nassir — 2026** 🚀
