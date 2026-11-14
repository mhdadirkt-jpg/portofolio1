// NOTE: this is a convenience gate only. On a static site the hash is visible to anyone who views the source.
// For real protection use your host (Netlify password protection, Cloudflare Access, Basic Auth on your server).
// Default password: "change-me". Generate a new hash with:  printf 'yourpass' | sha256sum
const PASS_HASH = "e2186dbdb1bb4193608605e84f33208765b5693b55edd4f730a719a100eeea6f";

const gate = document.getElementById("gate"), panel = document.getElementById("panel");
async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function unlock() {
  gate.hidden = true; panel.hidden = false;
  document.getElementById("count").textContent = PROJECTS.length;
  document.getElementById("rows").innerHTML = PROJECTS.map((p) => `<li><span>${p.title}</span><span class="muted">${p.type}</span></li>`).join("");
}
if (sessionStorage.getItem("adm") === PASS_HASH) unlock();
document.getElementById("gate-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const h = await sha(document.getElementById("pw").value);
  if (h === PASS_HASH) { sessionStorage.setItem("adm", h); unlock(); }
  else document.getElementById("gate-err").textContent = "Incorrect password.";
});
