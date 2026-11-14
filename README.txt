Static liquid-chrome site: plain HTML, CSS and JS. No build step.

Run locally:  python3 -m http.server 8000   then open http://localhost:8000
Deploy:       drag the folder onto Netlify, Cloudflare Pages, Vercel or GitHub Pages.

Contact form: open js/contact.js and paste your Web3Forms access key (register it with mhdadirkt@gmail.com),
or set formspreeUrl. Resend needs a server, so it is not used here.
Admin password: default "change-me" (see js/admin.js). It is a convenience gate only; protect /admin at your host for real security.
