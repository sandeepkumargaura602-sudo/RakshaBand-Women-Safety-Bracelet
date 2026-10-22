# RakshaBand — Women’s Safety Bracelet (Software Demo)

A responsive HTML/CSS/JavaScript prototype for exploring the RakshaBand software experience before physical components are available.

## Run locally
1. Download and extract this project.
2. Open `index.html` in a modern browser.
3. Hold the SOS button for 2 seconds to simulate an alert.
4. Use **Get my location** and grant browser permission to test opt-in location retrieval.

For more reliable geolocation, serve the files through localhost or HTTPS. Some browsers restrict location access when opening a file directly.

## Included demo features
- Hold-to-activate simulated SOS button
- Browser geolocation permission flow
- Add/remove trusted contacts (stored in browser localStorage)
- Local demo alert history
- Responsive layout for mobile and desktop

## Important limitations
This is a **software demo only**. It does not contact emergency services, send SMS or calls, share location with contacts, or control a physical bracelet. Contact information and demo history stay in the browser's local storage. Do not use this prototype as an actual safety service.

## Next development steps
- Connect a tested ESP32 firmware/hardware prototype.
- Design a secure backend and authentication.
- Add a verified notification provider and explicit consent.
- Perform safety, privacy, and reliability testing before any real-world use.
