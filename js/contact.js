// ---- CONFIG: choose ONE provider --------------------------------------------
const CONFIG = {
  // Web3Forms: get a free key at web3forms.com using mhdadirkt@gmail.com, paste it here.
  web3formsKey: "YOUR_WEB3FORMS_ACCESS_KEY",
  // Formspree: paste your endpoint (https://formspree.io/f/xxxx) to use it instead.
  formspreeUrl: "",
  // Resend can't be called from the browser (it would expose your API key); use a serverless function for it.
};

const TYPES = ["Brand Identity", "Logo Design", "Poster Design", "AI-Integrated Web Design"];
const form = document.getElementById("contact-form");
const success = document.getElementById("success");
const sendBtn = document.getElementById("send");
const formError = document.getElementById("form-error");
const els = { name: form.name, email: form.email, whatsapp: form.whatsapp, budget: form.budget, details: form.details };
const state = { projectType: "" };
const touched = {};

const rules = {
  name: (v) => (v.trim().length < 2 ? "Enter your full name." : ""),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email, like you@example.com."),
  whatsapp: (v) => (!v || /^\+?[0-9\s()-]{7,20}$/.test(v) ? "" : "Use digits only, with an optional + prefix."),
  projectType: () => (state.projectType ? "" : "Choose a project type."),
  details: (v) => (v.trim().length < 10 ? "Add at least a couple of sentences about the project." : ""),
};
const value = (k) => (k === "projectType" ? state.projectType : els[k].value);

function show(k) {
  const msg = touched[k] ? rules[k](value(k)) : "";
  const err = document.getElementById("err-" + k);
  err.textContent = msg;
  err.parentElement.querySelector(".field").classList.toggle("invalid", !!msg);
  const ctl = k === "projectType" ? document.getElementById("type-btn") : els[k];
  ctl.setAttribute("aria-invalid", !!msg);
}
Object.keys(rules).forEach((k) => {
  if (els[k]) {
    els[k].addEventListener("input", () => touched[k] && show(k));
    els[k].addEventListener("blur", () => { touched[k] = true; show(k); });
  }
});

// ---- Custom dropdown --------------------------------------------------------
const dd = document.getElementById("type-dropdown");
const ddBtn = document.getElementById("type-btn");
const ddList = document.getElementById("type-list");
const ddField = dd.querySelector(".field");
let active = 0;
ddList.innerHTML = TYPES.map((t, i) => `<li role="option" id="opt-${i}" data-i="${i}" aria-selected="false">${t}</li>`).join("");
const items = [...ddList.children];

function setOpen(o) {
  ddList.hidden = !o; ddField.classList.toggle("open", o); ddBtn.setAttribute("aria-expanded", o);
  if (o) highlight(Math.max(0, TYPES.indexOf(state.projectType)));
}
function highlight(i) {
  active = (i + TYPES.length) % TYPES.length;
  items.forEach((li, n) => li.classList.toggle("active", n === active));
  ddBtn.setAttribute("aria-activedescendant", "opt-" + active);
}
function pick(i) {
  state.projectType = TYPES[i];
  document.getElementById("type-label").textContent = TYPES[i];
  document.getElementById("type-label").classList.remove("ph");
  items.forEach((li, n) => li.setAttribute("aria-selected", n === i));
  setOpen(false); touched.projectType = true; show("projectType");
}
ddBtn.addEventListener("click", () => setOpen(ddList.hidden));
ddBtn.addEventListener("blur", () => { touched.projectType = true; show("projectType"); });
ddBtn.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setOpen(false);
  else if (e.key === "ArrowDown") { e.preventDefault(); ddList.hidden ? setOpen(true) : highlight(active + 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); ddList.hidden ? setOpen(true) : highlight(active - 1); }
  else if ((e.key === "Enter" || e.key === " ") && !ddList.hidden) { e.preventDefault(); pick(active); }
});
items.forEach((li, i) => {
  li.addEventListener("mouseenter", () => highlight(i));
  li.addEventListener("mousedown", (e) => e.preventDefault());
  li.addEventListener("click", () => pick(i));
});
document.addEventListener("mousedown", (e) => { if (!dd.contains(e.target)) setOpen(false); });

// ---- Submit -----------------------------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (form.company.value) return showSuccess(); // honeypot
  let bad = false;
  Object.keys(rules).forEach((k) => { touched[k] = true; show(k); if (rules[k](value(k))) bad = true; });
  if (bad) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }

  sendBtn.disabled = true; sendBtn.textContent = "Sending…"; formError.hidden = true;
  const payload = {
    name: els.name.value.trim(), email: els.email.value.trim(), whatsapp: els.whatsapp.value.trim(),
    projectType: state.projectType, budget: els.budget.value.trim(), message: els.details.value.trim(),
  };
  try {
    let res;
    if (CONFIG.formspreeUrl) {
      res = await fetch(CONFIG.formspreeUrl, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
    } else {
      if (CONFIG.web3formsKey.startsWith("YOUR_")) throw new Error("The form isn’t connected yet. Add your Web3Forms key in js/contact.js.");
      res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...payload, access_key: CONFIG.web3formsKey, subject: `New ${payload.projectType} enquiry from ${payload.name}`, from_name: "Portfolio Contact", replyto: payload.email }),
      });
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) throw new Error(data.message || "Could not send your message.");
    showSuccess();
  } catch (err) {
    formError.textContent = `${err.message} You can also email mhdadirkt@gmail.com directly.`;
    formError.hidden = false;
    sendBtn.disabled = false; sendBtn.textContent = "Send Message →";
  }
});

function showSuccess() {
  document.getElementById("success-name").textContent = els.name.value.trim().split(" ")[0] || "there";
  document.getElementById("success-email").textContent = els.email.value.trim();
  form.hidden = true; success.classList.add("show"); success.focus();
}
document.getElementById("again").addEventListener("click", () => {
  form.reset(); state.projectType = ""; Object.keys(touched).forEach((k) => delete touched[k]);
  document.getElementById("type-label").textContent = "Select a project type";
  document.getElementById("type-label").classList.add("ph");
  items.forEach((li) => li.setAttribute("aria-selected", "false"));
  Object.keys(rules).forEach(show);
  sendBtn.disabled = false; sendBtn.textContent = "Send Message →";
  success.classList.remove("show"); form.hidden = false;
});
