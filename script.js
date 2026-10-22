(() => {
  const $ = (id) => document.getElementById(id);
  const sosButton = $("sosButton");
  const holdProgress = $("holdProgress");
  const sosStatus = $("sosStatus");
  const historyList = $("historyList");
  const contactList = $("contactList");
  let holdTimer = null;
  let progressTimer = null;
  let startedAt = 0;
  let triggered = false;

  const readStore = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };
  const writeStore = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };

  let contacts = readStore("rakshaband_contacts_v2", []);
  let history = readStore("rakshaband_history_v2", []);

  function addHistory(title, detail) {
    history.unshift({ title, detail, time: new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) });
    history = history.slice(0, 8);
    writeStore("rakshaband_history_v2", history);
    renderHistory();
  }

  function renderHistory() {
    if (!history.length) {
      historyList.innerHTML = '<div class="empty-state">No demo alerts yet.</div>';
      return;
    }
    historyList.innerHTML = history.map(item => `
      <div class="history-item">
        <span class="history-dot"></span>
        <div><b>${escapeHTML(item.title)}</b><small>${escapeHTML(item.detail)} · ${escapeHTML(item.time)}</small></div>
      </div>`).join("");
  }

  function renderContacts() {
    if (!contacts.length) {
      contactList.innerHTML = '<div class="empty-state">Add a trusted contact to begin.</div>';
      return;
    }
    contactList.innerHTML = contacts.map((contact, index) => `
      <div class="contact-item">
        <div class="contact-person"><span class="avatar">${escapeHTML(contact.name.trim().charAt(0).toUpperCase() || "?")}</span>
          <div><b>${escapeHTML(contact.name)}</b><small>${escapeHTML(contact.phone || "No phone number added")}</small></div>
        </div>
        <button class="remove-contact" type="button" data-remove="${index}" aria-label="Remove ${escapeHTML(contact.name)}">×</button>
      </div>`).join("");
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function startHold(event) {
    if (event.type === "keydown" && ![" ", "Enter"].includes(event.key)) return;
    if (holdTimer || triggered) return;
    event.preventDefault();
    startedAt = Date.now();
    sosButton.classList.add("holding");
    sosStatus.textContent = "Keep holding…";
    progressTimer = window.setInterval(() => {
      const progress = Math.min(100, ((Date.now() - startedAt) / 2000) * 100);
      holdProgress.style.width = `${progress}%`;
    }, 25);
    holdTimer = window.setTimeout(() => {
      triggered = true;
      clearInterval(progressTimer);
      holdProgress.style.width = "100%";
      sosButton.classList.remove("holding");
      sosStatus.textContent = "Demo SOS activated. No message was sent.";
      addHistory("SOS demo activated", "Simulation only");
      if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
    }, 2000);
  }

  function endHold() {
    if (!holdTimer) return;
    clearTimeout(holdTimer);
    clearInterval(progressTimer);
    holdTimer = null;
    progressTimer = null;
    sosButton.classList.remove("holding");
    if (!triggered) {
      holdProgress.style.width = "0%";
      sosStatus.textContent = "Hold for 2 seconds to activate the demo.";
    }
  }

  sosButton.addEventListener("pointerdown", startHold);
  ["pointerup", "pointerleave", "pointercancel"].forEach(type => sosButton.addEventListener(type, endHold));
  sosButton.addEventListener("keydown", startHold);
  ["keyup", "blur"].forEach(type => sosButton.addEventListener(type, endHold));

  $("resetDemo").addEventListener("click", () => {
    endHold();
    triggered = false;
    holdProgress.style.width = "0%";
    sosStatus.textContent = "Demo is ready. No message will be sent.";
  });

  $("locationButton").addEventListener("click", () => {
    const text = $("locationText");
    if (!("geolocation" in navigator)) {
      text.textContent = "Geolocation is not supported by this browser.";
      return;
    }
    text.textContent = "Requesting permission…";
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude.toFixed(5);
      const lon = position.coords.longitude.toFixed(5);
      text.textContent = `${lat}, ${lon}`;
      $("mapPlaceholder").querySelector(".map-caption").textContent = "LOCATION AVAILABLE IN THIS PAGE";
      addHistory("Location accessed", "Browser permission granted");
    }, error => {
      const messages = {
        1: "Location permission was denied.",
        2: "Location is currently unavailable.",
        3: "Location request timed out."
      };
      text.textContent = messages[error.code] || "Could not get location.";
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 });
  });

  $("contactForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("contactName").value.trim();
    const phone = $("contactPhone").value.trim();
    if (!name) return;
    contacts.push({ name, phone });
    contacts = contacts.slice(-12);
    writeStore("rakshaband_contacts_v2", contacts);
    renderContacts();
    $("contactForm").reset();
  });

  contactList.addEventListener("click", event => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    contacts.splice(Number(button.dataset.remove), 1);
    writeStore("rakshaband_contacts_v2", contacts);
    renderContacts();
  });

  $("clearHistory").addEventListener("click", () => {
    history = [];
    writeStore("rakshaband_history_v2", history);
    renderHistory();
  });

  $("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    $("themeToggle").textContent = isLight ? "☾" : "☼";
    try { localStorage.setItem("rakshaband_theme_v2", isLight ? "light" : "dark"); } catch {}
  });

  try {
    if (localStorage.getItem("rakshaband_theme_v2") === "light") {
      document.body.classList.add("light");
      $("themeToggle").textContent = "☾";
    }
  } catch {}

  renderContacts();
  renderHistory();
})();
