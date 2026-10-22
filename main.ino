/*
  RakshaBand - ESP32 Emergency Alert Bracelet (prototype starter)
  Long-press button for 2 seconds toggles a LOCAL buzzer/vibration alert.

  Limitations: This does not send GPS, SMS, calls, or internet alerts.
  Do not connect a vibration motor directly to an ESP32 GPIO.
  Use suitable drivers and verify component ratings before powering the circuit.
*/
#include <Arduino.h>

const uint8_t BUTTON_PIN = 18;  // Button between GPIO18 and GND
const uint8_t BUZZER_PIN = 25;  // Active buzzer driver input
const uint8_t MOTOR_PIN  = 26;  // Motor driver input

const unsigned long DEBOUNCE_MS = 35;
const unsigned long LONG_PRESS_MS = 2000;
const unsigned long BUZZER_ON_MS = 250;
const unsigned long BUZZER_OFF_MS = 250;
const unsigned long MOTOR_ON_MS = 350;
const unsigned long MOTOR_OFF_MS = 450;

bool alertActive = false;
bool lastRawButton = HIGH;
bool stableButton = HIGH;
unsigned long lastDebounceTime = 0;
unsigned long pressStartedAt = 0;
bool longPressHandled = false;
unsigned long lastBuzzerChange = 0;
unsigned long lastMotorChange = 0;
bool buzzerOn = false;
bool motorOn = false;

void setOutputsOff() {
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(MOTOR_PIN, LOW);
  buzzerOn = false;
  motorOn = false;
}

void startAlert() {
  alertActive = true;
  lastBuzzerChange = millis();
  lastMotorChange = millis();
  buzzerOn = false;
  motorOn = false;
  Serial.println(F("ALERT ACTIVATED"));
}

void stopAlert() {
  alertActive = false;
  setOutputsOff();
  Serial.println(F("Alert stopped"));
}

void updateAlertOutputs(unsigned long now) {
  if (!alertActive) {
    setOutputsOff();
    return;
  }

  unsigned long buzzerInterval = buzzerOn ? BUZZER_ON_MS : BUZZER_OFF_MS;
  if (now - lastBuzzerChange >= buzzerInterval) {
    buzzerOn = !buzzerOn;
    digitalWrite(BUZZER_PIN, buzzerOn ? HIGH : LOW);
    lastBuzzerChange = now;
  }

  unsigned long motorInterval = motorOn ? MOTOR_ON_MS : MOTOR_OFF_MS;
  if (now - lastMotorChange >= motorInterval) {
    motorOn = !motorOn;
    digitalWrite(MOTOR_PIN, motorOn ? HIGH : LOW);
    lastMotorChange = now;
  }
}

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(MOTOR_PIN, OUTPUT);
  setOutputsOff();
  Serial.begin(115200);
  delay(200);
  Serial.println();
  Serial.println(F("RakshaBand prototype ready."));
  Serial.println(F("Hold button for 2 seconds to start/stop local alert."));
}

void loop() {
  const unsigned long now = millis();
  const bool rawButton = digitalRead(BUTTON_PIN);

  if (rawButton != lastRawButton) {
    lastDebounceTime = now;
    lastRawButton = rawButton;
  }

  if (now - lastDebounceTime >= DEBOUNCE_MS && rawButton != stableButton) {
    stableButton = rawButton;
    if (stableButton == LOW) {
      pressStartedAt = now;
      longPressHandled = false;
    } else {
      pressStartedAt = 0;
      longPressHandled = false;
    }
  }

  if (stableButton == LOW && !longPressHandled &&
      pressStartedAt != 0 && now - pressStartedAt >= LONG_PRESS_MS) {
    longPressHandled = true;
    if (alertActive) stopAlert();
    else startAlert();
  }

  updateAlertOutputs(now);
}
