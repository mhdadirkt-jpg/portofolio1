// Shared data + header/footer injection
const PROJECTS = [
  { title: "Obsidian & Co.", type: "Brand Identity", blurb: "A full identity system for a luxury watch atelier: wordmark, palette, packaging and guidelines." },
  { title: "Halo Mark", type: "Logo Design", blurb: "A monoline emblem built on a single continuous stroke, tested down to 16px." },
  { title: "Night Shift Series", type: "Poster Design", blurb: "Three-poster run for an electronic music night, printed in metallic silver ink." },
  { title: "Atlas AI Studio", type: "AI-Integrated Web Design", blurb: "A marketing site with an embedded assistant that drafts briefs from a visitor’s answers." },
];

const NAV = [["index.html", "Home"], ["about.html", "About"], ["projects.html", "Projects"], ["contact.html", "Contact"]];

(function () {
  const page = location.pathname.split("/").pop() || "index.html";
  const links = NAV.map(([h, l]) => `<a href="${h}" class="${h === page ? "active" : ""}">${l}</a>`).join("");
  document.body.insertAdjacentHTML("afterbegin",
    `<header class="site-header"><nav aria-label="Main">
      <a href="index.html" class="logo chrome-text">Adil</a>
      <button class="menu-btn" aria-expanded="false" aria-controls="nav-links">Menu</button>
      <div class="nav-links" id="nav-links">${links}</div></nav></header>`);
  document.body.insertAdjacentHTML("beforeend",
    `<footer class="site-footer"><div class="wrap"><p>© ${new Date().getFullYear()} Adil. All rights reserved.</p>
      <p><a href="mailto:mhdadirkt@gmail.com">mhdadirkt@gmail.com</a> &nbsp;|&nbsp; <a href="admin.html">Admin</a></p></div></footer>`);
  const btn = document.querySelector(".menu-btn"), nav = document.getElementById("nav-links");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open); btn.textContent = open ? "Close" : "Menu";
  });

  // Inject liquid background into any .section[data-liquid]
  document.querySelectorAll("[data-liquid]").forEach((el) => {
    el.insertAdjacentHTML("afterbegin",
      `<div class="bg" aria-hidden="true"><div class="blob b1"></div><div class="blob b2"></div>
        <svg xmlns="http://www.w3.org/2000/svg"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#grain)"/></svg>
        <div class="vignette"></div></div>`);
  });

  // Render projects where requested
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  document.querySelectorAll("[data-projects]").forEach((el) => {
    const n = Number(el.dataset.projects) || PROJECTS.length;
    el.innerHTML = PROJECTS.slice(0, n).map((p) =>
      `<article class="card glass"><p class="small">${esc(p.type)}</p><div><h3>${esc(p.title)}</h3><p class="muted">${esc(p.blurb)}</p></div></article>`).join("");
  });
})();
