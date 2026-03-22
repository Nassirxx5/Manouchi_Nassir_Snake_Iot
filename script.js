// 1. CONFIGURATION ET VARIABLES GLOBALES
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20; // Le canvas fait 400x400, donc 20x20 cases
const tileCount = canvas.width / gridSize;

let snake = [];
let food = { x: 0, y: 0 };
let dx = 0; // Direction horizontale (1 = droite, -1 = gauche)
let dy = 0; // Direction verticale (1 = bas, -1 = haut)
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameOver = false;

// Gestion du temps pour requestAnimationFrame
let lastRenderTime = 0;
const snakeSpeed = 8; // Vitesse du jeu (cases par seconde)

// Afficher le high score au démarrage
document.getElementById('high-score').innerText = highScore;

// 2. INITIALISATION DU JEU
function initGame() {
    // Placer le serpent au centre
    snake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 }, // Un petit corps de départ
        { x: 10, y: 12 }
    ];
    dx = 0;
    dy = -1; // Commence en allant vers le haut
    score = 0;
    gameOver = false;
    document.getElementById('current-score').innerText = score;
    placeFood();
    window.requestAnimationFrame(mainLoop);
}

// Placer la pomme aléatoirement (sans qu'elle soit sur le serpent)
function placeFood() {
    let validPosition = false;
    while (!validPosition) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        
        // Vérifier que la pomme n'est pas sur le serpent
        validPosition = true;
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                validPosition = false;
                break;
            }
        }
    }
}

// 3. LA BOUCLE DE JEU (GAME LOOP)
function mainLoop(currentTime) {
    if (gameOver) {
        handleGameOver();
        return; // Arrête la boucle
    }

    // Demande au navigateur de préparer la prochaine frame
    window.requestAnimationFrame(mainLoop);

    // Calculer le temps écoulé depuis le dernier rendu
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    
    // Si pas assez de temps ne s'est écoulé, on ne met pas à jour (contrôle la vitesse)
    if (secondsSinceLastRender < 1 / snakeSpeed) return;

    lastRenderTime = currentTime;

    update(); // Mettre à jour la logique
    draw();   // Dessiner le résultat
}

// 4. LOGIQUE DU JEU (Mouvements & Collisions)
function update() {
    // Calculer la position de la nouvelle tête
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 4.1 Vérifier les collisions avec les murs
    if (newHead.x < 0 || newHead.x >= tileCount || newHead.y < 0 || newHead.y >= tileCount) {
        gameOver = true;
        return;
    }

    // 4.2 Vérifier les collisions avec soi-même
    for (let segment of snake) {
        if (newHead.x === segment.x && newHead.y === segment.y) {
            gameOver = true;
            return;
        }
    }

    // Ajouter la nouvelle tête au début du tableau
    snake.unshift(newHead);

    // 4.3 Vérifier si le serpent mange la pomme
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        document.getElementById('current-score').innerText = score;
        placeFood(); // Nouvelle pomme, on ne retire pas la queue (donc il grandit)
    } else {
        // S'il ne mange pas, on retire le dernier segment (il avance)
        snake.pop();
    }
}

function handleGameOver() {
    // Sauvegarder le high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        document.getElementById('high-score').innerText = highScore;
    }

    // Effet visuel simple
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.fillText("Appuyez sur ESPACE pour rejouer", canvas.width / 2, canvas.height / 2 + 30);
}

// 5. AFFICHAGE (Rendu sur le Canvas)
function draw() {
    // Effacer l'écran
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner la nourriture (Rouge)
    ctx.fillStyle = '#e94560';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Dessiner le serpent (Vert cyan)
    snake.forEach((segment, index) => {
        // La tête d'une couleur légèrement différente
        ctx.fillStyle = index === 0 ? '#00ffff' : '#00b3b3';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

// 6. CONTRÔLES (Clavier)
window.addEventListener('keydown', e => {
    // Empêcher de faire demi-tour (si dx === 1, on ne peut pas faire dx = -1)
    if (e.key === 'ArrowUp' && dy !== 1) { dx = 0; dy = -1; }
    if (e.key === 'ArrowDown' && dy !== -1) { dx = 0; dy = 1; }
    if (e.key === 'ArrowLeft' && dx !== 1) { dx = -1; dy = 0; }
    if (e.key === 'ArrowRight' && dx !== -1) { dx = 1; dy = 0; }
    
    // Relancer le jeu avec Espace
    if (e.key === ' ' && gameOver) {
        initGame();
    }
});

// 7. CONTRÔLES MATÉRIELS (Web Serial API - Arduino)
let serialPort;

class LineBreakTransformer {
    constructor() { this.chunks = ""; }
    transform(chunk, controller) {
        this.chunks += chunk;
        const lines = this.chunks.split("\r\n");
        this.chunks = lines.pop();
        lines.forEach((line) => controller.enqueue(line));
    }
    flush(controller) { controller.enqueue(this.chunks); }
}

async function connectSerial() {
    // 1. SÉCURITÉ : Si le port est déjà ouvert, on ne fait rien
    if (serialPort && serialPort.readable) {
        console.log("Le port est déjà ouvert, pas besoin de le rouvrir.");
        return; 
    }

    try {
        serialPort = await navigator.serial.requestPort();
        await serialPort.open({ baudRate: 9600 });
        
        document.getElementById('status').innerText = "Statut : Manette Connectée 🎮";
        
        // 2. ERGONOMIE : On désactive le bouton une fois connecté
        document.getElementById('connectBtn').disabled = true;
        document.getElementById('connectBtn').innerText = "Arduino Connecté ✅";
        document.getElementById('connectBtn').style.backgroundColor = "#00ffcc";
        document.getElementById('connectBtn').style.color = "#1a1a2e";
        
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
        const reader = textDecoder.readable
            .pipeThrough(new TransformStream(new LineBreakTransformer()))
            .getReader();

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                reader.releaseLock();
                break;
            }
            if (value) {
                const command = value.trim();
                if (command === 'U' && dy !== 1) { dx = 0; dy = -1; }
                if (command === 'D' && dy !== -1) { dx = 0; dy = 1; }
                if (command === 'L' && dx !== 1) { dx = -1; dy = 0; }
                if (command === 'R' && dx !== -1) { dx = 1; dy = 0; }
            }
        }
    } catch (error) {
        console.error("Erreur de connexion série :", error);
        document.getElementById('status').innerText = "Statut : Erreur / Déconnecté";
    }
}

document.getElementById('connectBtn').addEventListener('click', connectSerial);

// DÉMARRAGE DU JEU
initGame();
