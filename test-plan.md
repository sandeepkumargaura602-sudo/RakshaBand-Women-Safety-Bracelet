# RakshaBand prototype test plan

Record real observations only after performing the tests. Do not invent measurements for the presentation.

| Test | Procedure | Record |
|---|---|---|
| Startup | Power ESP32 from a suitable regulated supply. | Startup message; resets or faults |
| Button debounce | Press/release repeatedly. | Unexpected activations |
| Short press | Press for less than 2 seconds. | Alert should stay OFF |
| Long press | Hold continuously for at least 2 seconds. | Alert should toggle ON |
| Alert outputs | Test buzzer and motor driver separately, then together. | Behaviour and any resets |
| Power stability | Measure supply voltage during alert activation safely. | Voltage before/during alert |
| Runtime | Run a controlled test with the correct battery. | Duration and test conditions |
| Wearability | Check enclosure fit without exposed wiring. | Fit, weight, button access, comfort |
