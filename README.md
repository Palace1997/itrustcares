# iTrust Cares — Website

A static, SEO-ready website for iTrust Cares (senior mental health & cognitive support).
No build step, no framework — pure HTML/CSS/JS. Host it anywhere that serves static files
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, or any web host).

## Pages
- `index.html` — Home
- `services.html` — Services (On-site Care, Screenings, Skilled Nursing – coming soon)
- `communities.html` — For senior living communities (+ partnership inquiry form)
- `partners.html` — Partners (SoCalm SC)
- `about.html` — About Us + Our Providers
- `faq.html` — Frequently Asked Questions
- `careers.html` — Careers
- `contact.html` — Contact (+ contact form)
- `privacy.html` — Privacy Policy
- `404.html` — Not-found page

## Brand
- **Colors:** deep green `#223a2a` / `#17281e`, sage `#94a276`, terracotta accent `#c46530`,
  creams `#f4ebe1` / `#e4dac4`. Defined as CSS variables in `assets/css/styles.css`.
- **Fonts:** GT Super Display (headings, self-hosted in `assets/fonts/`) + Plus Jakarta Sans
  (body, loaded from Google Fonts).
- **Logo:** `assets/images/logo-green.svg` (header) and `logo-white.svg` (footer).

## SEO — included out of the box
- Unique `<title>` + meta description per page
- Canonical URLs, Open Graph + Twitter cards
- JSON-LD structured data (MedicalBusiness, FAQPage, BreadcrumbList)
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, SVG favicon
- Semantic HTML, skip-link, accessible nav/accordion, alt text

## Homepage statistics — verified & sourced
The three "By the Numbers" figures are now real, cited figures (the original copy's sources
couldn't be verified, so accurate sources were substituted):
- **36%** of newly admitted residents experience depression or anxiety — *Journal of Nursing Home Research* (2019)
- **49%** of nursing home residents are diagnosed with depression — CDC, National Study of Long-Term Care Providers
- **34%** of older adults report a lack of companionship — University of Michigan National Poll on Healthy Aging (2018)

Please confirm these fit how you want to represent your audience before launch. To change one,
edit both the `data-count` value and the visible number in the stat block in `index.html`.

## Photography
Photos live in `assets/images/photos/` and provider headshots in `assets/images/team/`.
Sources:
- **Your istock library** (via itrustcares.com) — provider headshots + most section/hero photos. Model-released.
- **Pexels** (free commercial-use license, no attribution required) — Services, FAQ, Careers, and
  Communities hero photos (`services-hero.jpg`, `faq-hero.jpg`, `careers-hero.jpg`,
  `communities-hero.jpg`). Note: free-stock people photos
  are not individually model-released; fine for general lifestyle use, but confirm with counsel if
  you're unsure about using them in paid advertising.

Each photo is used exactly **once** across the site (no repeats). To swap one, replace the file
(keep the filename) or edit the `.page-hero__bg` inline style on that page. Privacy is the only
page with a plain green hero (intentional — legal page).

## Hero photos — final (tuning panels removed)
Hero background photos are baked in with a brightness of 0.7 for legibility. The home hero uses
`hero-header.jpg`; interior heroes use the layered `.page-hero__bg` / `.page-hero__scrim` markup
with the image, brightness, and crop position set inline (e.g. About = `background-position: 50% 29%`).
To adjust a hero photo, edit the `.page-hero__bg` inline style on that page (or `.hero__bg` in the CSS
for the home hero). All live tuning panels (logo, hero, spacing) have been removed.

## ⚠️ Before launch — 1 thing to finish
1. **Privacy Policy** (`privacy.html`): a general web privacy policy is provided. Search for
   `LEGAL REVIEW NEEDED` and have counsel confirm it (and your separate HIPAA Notice of Privacy
   Practices, if applicable).

## Forms
Both forms (Contact on `contact.html`, Partnership on `communities.html`) are wired for
**[Formspree](https://formspree.io)** — a host-agnostic form backend that works on any static host.
They submit via AJAX with an inline success/error message, a hidden honeypot spam trap, and native
field validation. No page reload; no backend code to maintain.

**To turn them on (2 minutes):**
1. Create a free Formspree account and add two forms (one for contact, one for partnership).
2. Formspree gives each form an endpoint like `https://formspree.io/f/abcdwxyz`.
3. In `contact.html`, replace `YOUR_CONTACT_FORM_ID` with your contact form's ID.
4. In `communities.html`, replace `YOUR_PARTNERSHIP_FORM_ID` with your partnership form's ID.

Submissions are emailed to the address on your Formspree account. Until the IDs are added, the
forms show a friendly "not connected yet" message instead of failing silently.

Prefer a different provider? The forms are standard `POST` forms — swap the `action` URL for
Netlify Forms, your CRM, or any endpoint. The AJAX handler expects a JSON response (Formspree
convention); for a plain endpoint, remove the `data-ajax` attribute to fall back to a normal submit.

## Preview locally
```
cd website
python3 -m http.server 8000
# open http://localhost:8000
```
