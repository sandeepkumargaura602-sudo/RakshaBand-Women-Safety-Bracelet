# RakshaBand — Professional Software Demo

A responsive student prototype for the RakshaBand women's safety bracelet. Built with HTML, CSS and vanilla JavaScript.

## Run locally
Open `index.html` in a modern browser, or use VS Code with Live Server. For geolocation, serve via localhost or HTTPS and grant browser permission.

## Demo features
- Hold SOS for two seconds to simulate an alert
- Optional browser geolocation (not shared with anyone)
- Add/remove trusted contacts stored in this browser's local storage
- Local activity history and alert counter
- Responsive dashboard and light/dark appearance toggle

## Important
This is a software simulation only. It does not send SMS/calls, contact emergency services, or connect to a physical bracelet. Contact data and activity are stored locally in the browser. Do not use this prototype as a real emergency service.

## Roadmap
1. Test the UI and browser permission flow.
2. Integrate tested ESP32 hardware and driver circuitry.
3. Design a secure, consent-based notification backend and validate it thoroughly before real-world use.
