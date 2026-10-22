# RakshaBand — Women's Safety Bracelet (Prototype Starter)

Starter firmware for an ESP32-based wearable alert bracelet concept.

## Current features
- Hold the button continuously for 2 seconds to toggle a local alert.
- Active buzzer and vibration motor run in repeating patterns while alert is active.
- Button debounce and Serial Monitor status messages.

## Important limitations
This code only produces a **local sound/vibration alert**. It does **not** send GPS coordinates, SMS, calls, internet notifications, or contact emergency services. Do not claim these features are implemented unless you add and test them.

This is prototype code, not a certified safety device. Bench-test it before wearing it.

## Suggested hardware
- ESP32 development board
- Momentary push button
- Active buzzer and suitable driver if needed
- Vibration motor with transistor/MOSFET driver
- Suitable battery, protection and regulated power circuitry
- Wires and bracelet enclosure

Use the exact datasheets for your components. Never connect a vibration motor directly to an ESP32 GPIO. Battery charging/protection must match the exact battery and board.

## Pin mapping used in code
| Function | GPIO | Connection |
|---|---:|---|
| Button | 18 | Button between GPIO18 and GND; internal pull-up is enabled |
| Buzzer | 25 | Driver/input for a compatible active buzzer |
| Vibration motor | 26 | Transistor/MOSFET driver input; not the motor itself |

The code assumes driver inputs are active HIGH. Adjust the pins if your wiring differs.

## Upload using Arduino IDE
1. Install Arduino IDE.
2. Install ESP32 board support from Boards Manager.
3. Open `src/main.ino`.
4. Select the correct ESP32 board and COM port.
5. Upload, then open Serial Monitor at **115200 baud**.
6. Verify the button behaviour and test outputs safely, one at a time.

## Documentation
- [Wiring notes](documentation/wiring-notes.md)
- [Test plan](documentation/test-plan.md)

## Project status
Starter firmware only. Hardware integration, power validation, enclosure testing, and any remote-alert feature still need implementation and verification.
