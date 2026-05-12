// Pins pour le Joystick
const int pinX = A0;
const int pinY = A1;

// Pins pour la LED RGB
const int pinR = 9;
const int pinG = 10;
const int pinB = 11;

void setup() {
  Serial.begin(9600);
  
  pinMode(pinR, OUTPUT);
  pinMode(pinG, OUTPUT);
  pinMode(pinB, OUTPUT);
  
  // LED éteinte au départ
  setRGB(0, 0, 0); 
}

void loop() {
  // --- 1. ENVOI : Lecture du Joystick ---
  int xVal = analogRead(pinX);
  int yVal = analogRead(pinY);

  if (yVal < 300) Serial.println("U");
  else if (yVal > 700) Serial.println("D");
  else if (xVal < 300) Serial.println("L");
  else if (xVal > 700) Serial.println("R");

  // --- 2. RÉCEPTION : Lecture des ordres du PC ---
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    
    if (cmd == 'S') {        // START : Bleu
      setRGB(0, 0, 255);
    } 
    else if (cmd == 'E') {   // EAT : Flash Vert rapide
      setRGB(0, 255, 0);
      delay(100); 
      setRGB(0, 0, 255);     // Repasse au bleu
    } 
    else if (cmd == 'G') {   // GAME OVER : Rouge
      setRGB(255, 0, 0);
    }
  }

  delay(50); // Petite pause pour la stabilité
}

// Fonction pour changer la couleur facilement
void setRGB(int r, int g, int b) {
  analogWrite(pinR, r);
  analogWrite(pinG, g);
  analogWrite(pinB, b);
}
