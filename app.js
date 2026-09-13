/* ============================================================
   CONFIGURATION — Edit these values for your store
   ============================================================ */
const CONFIG = {
  // Your Vodafone Cash phone number
  phoneNumber: "01097436673",

  // Your InstaPay deep link
  instaPayLink: "https://ipn.eg/S/hassan7771/instapay/4l8OPn",

  // Your Vodafone App transfer link
  vfAppLink: "http://vf.eg/vfcash?id=mt&qrId=5nfLnQ",

  // USSD code template — {phone} and {amount} will be replaced
  ussdTemplate: "*9*7*{phone}*{amount}#",
};

/* ============================================================
   PARTICLES
   ============================================================ */
(function spawnParticles() {
  const container = document.getElementById("particles");
  const colors = [
    "rgba(230,0,0,0.6)",
    "rgba(0,179,134,0.6)",
    "rgba(124,58,237,0.5)",
    "rgba(255,255,255,0.2)",
  ];

  for (let i = 0; i < 22; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
})();

/* ============================================================
   SCREEN NAVIGATION
   ============================================================ */
function showScreen(screenId) {
  // Hide all screens and main content
  document.querySelectorAll(".screen, .main-content").forEach((el) => {
    el.classList.add("hidden");
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.remove("hidden");
    // Re-trigger animation
    target.style.animation = "none";
    requestAnimationFrame(() => {
      target.style.animation = "";
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  // Populate phone numbers
  const phoneEl = document.getElementById("phone-text");
  const phoneElOther = document.getElementById("phone-text-other");
  if (phoneEl) phoneEl.textContent = CONFIG.phoneNumber;
  if (phoneElOther) phoneElOther.textContent = CONFIG.phoneNumber;
}

/* ============================================================
   COPY PHONE NUMBER
   ============================================================ */
function copyPhone() {
  doCopy(CONFIG.phoneNumber, "copy-btn", "copied-toast");
}

function copyPhoneOther() {
  doopy(CONFIG.phoneNumber, "copy-btn-other", "copied-toast-other");
}

// unified copy helper
function doopy(text, btnId, toastId) {
  navigator.clipboard
    .writeText(text)
    .then(() => showToast(toastId))
    .catch(() => {
      // fallback for older browsers / WebViews
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(toastId);
    });
}

function doopy2(text, btnId, toastId) {
  doopy(text, btnId, toastId);
}

// patch the two copy functions to use unified helper
function copyPhone() {
  doopy(CONFIG.phoneNumber, "copy-btn", "copied-toast");
}
function copyPhoneOther() {
  doopy(CONFIG.phoneNumber, "copy-btn-other", "copied-toast-other");
}

function showToast(toastId) {
  const toast = document.getElementById(toastId);
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

/* ============================================================
   TOGGLE EXPAND SECTION
   ============================================================ */
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.classList.toggle("hidden");
  if (!section.classList.contains("hidden")) {
    section.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

/* ============================================================
   USSD DIAL
   ============================================================ */
function dialUSSD() {
  const amountInput = document.getElementById("amount-ussd");
  const amount = amountInput ? amountInput.value.trim() : "";

  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    shakeInput(amountInput);
    return;
  }

  // Build USSD code e.g. *9*7*01XXXXXXXXX*100#
  const ussd = CONFIG.ussdTemplate
    .replace("{phone}", CONFIG.phoneNumber)
    .replace("{amount}", amount);

  // tel: URI dials the USSD code on mobile
  const telUri = "tel:" + encodeURIComponent(ussd);
  window.location.href = telUri;
}

function shakeInput(inputEl) {
  if (!inputEl) return;
  inputEl.style.animation = "none";
  requestAnimationFrame(() => {
    inputEl.style.animation = "shake 0.4s ease";
  });

  // Inject shake keyframes once
  if (!document.getElementById("shake-style")) {
    const style = document.createElement("style");
    style.id = "shake-style";
    style.textContent = `
      @keyframes shake {
        0%,100% { transform: translateX(0); }
        20%      { transform: translateX(-8px); }
        40%      { transform: translateX(8px); }
        60%      { transform: translateX(-5px); }
        80%      { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }

  inputEl.focus();
  inputEl.style.borderColor = "rgba(230,0,0,0.8)";
  setTimeout(() => (inputEl.style.borderColor = ""), 1000);
}

/* ============================================================
   VODAFONE APP LINK
   ============================================================ */
function openVFApp() {
  window.open(CONFIG.vfAppLink, "_blank");
}

/* ============================================================
   INSTAPAY
   ============================================================ */
function openInstaPay() {
  // Flash the background for visual feedback
  document.body.classList.add("ip-flash");
  setTimeout(() => document.body.classList.remove("ip-flash"), 400);

  // Open InstaPay link
  setTimeout(() => {
    window.location.href = CONFIG.instaPayLink;
  }, 180);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Make sure home screen is visible on load
  showScreen("home-screen");

  // Allow pressing Enter on amount input to trigger dial
  const amountInput = document.getElementById("amount-ussd");
  if (amountInput) {
    amountInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") dialUSSD();
    });
  }
});
