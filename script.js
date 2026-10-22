const $ = (id) => document.getElementById(id);

let contacts = JSON.parse(localStorage.getItem("rakshaband_contacts") || "null") || [
  { id: 1, name: "Trusted Contact 1", phone: "Add a real number later" },
  { id: 2, name: "Trusted Contact 2", phone: "Add a real number later" }
];
let history = JSON.parse(localStorage.getItem("rakshaband_history") || "[]");
let holdTimer = null;
let holdStarted = 0;
let progressTimer = null;
let alertActive = false;

function saveContacts() {
  localStorage.setItem("rakshaband_contacts", JSON.stringify(contacts));
  renderContacts();
}
function renderContacts() {
  $("contactCount").textContent = `${contacts.length} saved`;
  const list = $("contactList");
  list.innerHTML = "";
  if (!contacts.length) {
    list.innerHTML = '<div class="empty-state">No contacts yet. Add someone you trust.</div>';
    return;
  }
  contacts.forEach((contact) => {
    const card = document.createElement("div");
    card.className = "contact-card";
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = (contact.name.trim()[0] || "?").toUpperCase();
    const info = document.createElement("div");
    info.className = "contact-info";
    const name = document.createElement("strong");
    name.textContent = contact.name;
    const phone = document.createElement("small");
    phone.textContent = contact.phone;
    info.append(name, phone);
    const remove = document.createElement("button");
    remove.className = "remove-contact";
    remove.type = "button";
    remove.title = "Remove contact";
    remove.setAttribute("aria-label", `Remove ${contact.name}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      contacts = contacts.filter((c) => c.id !== contact.id);
      saveContacts();
    });
    card.append(avatar, info, remove);
    list.append(card);
  });
}
function renderHistory() {
  const list = $("historyList");
  list.innerHTML = "";
  if (!history.length) {
    list.innerHTML = '<div class="empty-state">No demo alerts yet. Try the SOS button above.</div>';
    return;
  }
  history.slice().reverse().forEach((entry) => {
    const row = document.createElement("div");
    row.className = "history-entry";
    const symbol = document.createElement("div");
    symbol.className = "history-symbol";
    symbol.textContent = "!";
    const content = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = entry.title;
    const detail = document.createElement("p");
    detail.textContent = entry.detail;
    content.append(title, detail);
    const time = document.createElement("time");
    time.textContent = entry.time;
    row.append(symbol, content, time);
    list.append(row);
  });
}
function addHistory(title, detail) {
  history.push({ title, detail, time: new Date().toLocaleString() });
  history = history.slice(-30);
  localStorage.setItem("rakshaband_history", JSON.stringify(history));
  renderHistory();
}
function triggerSOS() {
  if (alertActive) return;
  alertActive = true;
  $("statusChip").textContent = "DEMO ALERT ACTIVE";
  $("statusChip").style.color = "var(--pink2)";
  $("statusChip").style.borderColor = "#ff557855";
  $("holdHint").textContent = "Demo SOS activated. No real message or call was sent.";
  $("sosButton").innerHTML = '<span class="sos-icon">✓</span><strong>ALERT</strong><small>DEMO ACTIVATED</small>';
  addHistory("SOS demo activated", "Local interface only. No emergency service, SMS, or call was contacted.");
  if (navigator.vibrate) navigator.vibrate([100, 60, 100]);
}
function startHold(event) {
  if (event.type === "keydown" && ![" ", "Enter"].includes(event.key)) return;
  if (event.type === "keydown" && event.repeat) return;
  if (alertActive || holdTimer) return;
  holdStarted = Date.now();
  $("holdHint").textContent = "Keep holding…";
  progressTimer = setInterval(() => {
    const progress = Math.min(100, ((Date.now() - holdStarted) / 2000) * 100);
    $("holdProgress").style.width = `${progress}%`;
  }, 30);
  holdTimer = setTimeout(() => {
    stopHold(false);
    triggerSOS();
  }, 2000);
}
function stopHold(cancel = true) {
  if (holdTimer) clearTimeout(holdTimer);
  if (progressTimer) clearInterval(progressTimer);
  holdTimer = null;
  progressTimer = null;
  if (cancel && !alertActive) {
    $("holdProgress").style.width = "0%";
    $("holdHint").textContent = "Hold for 2 seconds to simulate SOS.";
  }
}
const sos = $("sosButton");
sos.addEventListener("pointerdown", (e) => { e.preventDefault(); startHold(e); });
["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => sos.addEventListener(eventName, () => stopHold(true)));
sos.addEventListener("keydown", startHold);
sos.addEventListener("keyup", () => stopHold(true));
sos.addEventListener("contextmenu", (e) => e.preventDefault());

$("resetButton").addEventListener("click", () => {
  stopHold(true);
  alertActive = false;
  $("statusChip").textContent = "SYSTEM READY";
  $("statusChip").style.color = "var(--mint)";
  $("statusChip").style.borderColor = "#66e3c43a";
  $("sosButton").innerHTML = '<span class="sos-icon">!</span><strong>SOS</strong><small>HOLD 2 SECONDS</small>';
  $("holdProgress").style.width = "0%";
  $("holdHint").textContent = "Demo reset. Hold to simulate an alert again.";
  addHistory("Demo reset", "The interface has returned to ready state.");
});
$("locationButton").addEventListener("click", () => {
  const text = $("locationText");
  if (!navigator.geolocation) {
    text.textContent = "Geolocation is not supported by this browser.";
    return;
  }
  text.textContent = "Requesting browser permission…";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(5);
      const lon = position.coords.longitude.toFixed(5);
      text.textContent = `Latitude ${lat}, Longitude ${lon} (shown only in this browser)`;
      addHistory("Location retrieved", "Browser location permission was granted. Location was not sent to anyone.");
    },
    (error) => {
      const messages = {
        1: "Permission denied. Allow location access in your browser if you want to test this.",
        2: "Location unavailable. Try again where GPS/location is available.",
        3: "Location request timed out. Try again."
      };
      text.textContent = messages[error.code] || "Could not retrieve location.";
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
});
$("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("contactName").value.trim();
  const phone = $("contactPhone").value.trim();
  if (!name || !phone) return;
  contacts.push({ id: Date.now(), name, phone });
  saveContacts();
  $("contactForm").reset();
});
$("clearHistory").addEventListener("click", () => {
  history = [];
  localStorage.setItem("rakshaband_history", "[]");
  renderHistory();
});
renderContacts();
renderHistory();
