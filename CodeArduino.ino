// Définition des broches
const int pinX = A0;
const int pinY = A1;

// Variable pour mémoriser la dernière commande envoyée
// Cela évite d'inonder le navigateur de messages si on maintient le joystick
char lastCommand = ' ';

void setup() {
  // Initialisation de la communication série à 9600 bauds (doit correspondre au JavaScript)
  Serial.begin(9600);
}

void loop() {
  // Lecture des valeurs analogiques (entre 0 et 1023)
  // Au repos, le joystick renvoie environ 512.
  int xValue = analogRead(pinX);
  int yValue = analogRead(pinY);
  
  char currentCommand = ' ';

  // Définition d'une "zone morte" (deadzone) entre 400 et 600 
  // pour éviter que le serpent ne bouge tout seul si le joystick n'est pas parfaitement centré
  if (xValue < 400) {
    currentCommand = 'L'; // Gauche
  } else if (xValue > 600) {
    currentCommand = 'R'; // Droite
  } else if (yValue < 400) {
    currentCommand = 'U'; // Haut (Attention: l'axe Y peut être inversé selon l'orientation physique de ton joystick)
  } else if (yValue > 600) {
    currentCommand = 'D'; // Bas
  }

  // Si on détecte une direction ET qu'elle est différente de la dernière envoyée
  if (currentCommand != ' ' && currentCommand != lastCommand) {
    Serial.println(currentCommand); // Envoie la lettre suivie d'un retour à la ligne
    lastCommand = currentCommand;
  }
  
  // Si le joystick revient au centre, on réinitialise la dernière commande
  // Cela permet de repousser le joystick dans la même direction ensuite
  if (currentCommand == ' ') {
    lastCommand = ' ';
  }

  // Petite pause pour stabiliser la lecture
  delay(50);
}
