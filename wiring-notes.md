# Prototype wiring notes

These are starting notes, not a final circuit design. Confirm your exact parts and datasheets first.

- Button: one side to GPIO18, other side to GND. The code uses `INPUT_PULLUP`, so pressed reads LOW.
- Buzzer: GPIO25 controls a suitable buzzer driver/input. Check rated voltage and current; use a transistor driver if required.
- Vibration motor: GPIO26 controls a transistor/MOSFET driver. Never connect the motor directly to the ESP32 GPIO.
- Use a suitable motor supply and driver; connect grounds as required by the driver design.
- Add flyback protection where required by the motor/driver datasheet.
- Battery charging, protection and voltage regulation must be suitable for the exact battery and board. Do not improvise Li-Po charging circuitry.

Before wearing the prototype, inspect for exposed conductors, heating, sharp edges, battery damage, and loose components.
