# Reddy Steady Go LLC — Website

Enterprise-style marketing site for **Reddy Steady Go LLC**, a concrete, masonry, and commercial paving contractor based in Omaha, Nebraska (owner: Kris Reddy).

Plain HTML/CSS/JS, no build step required. Pages:

- `index.html` — home, with a by-the-numbers stats bar, certification badges, and a capabilities/government-contracting teaser
- `services.html` — concrete, masonry, commercial paving, repair/mudjacking
- `capabilities.html` — capability statement: core competencies, differentiators, NAICS/UEI/CAGE/bonding data, certifications, core markets (residential/commercial/municipal)
- `gallery.html` — featured case studies plus a filterable project gallery
- `about.html` — company story, leadership, values, timeline
- `contact.html` — contact info, hours, map, estimate request form
- `areas/index.html` + `areas/{papillion,bellevue,la-vista,elkhorn,council-bluffs}.html` — service-area landing pages, each with unique intro copy and city-scoped LocalBusiness schema, linked from every page's footer

## Site configuration (`js/data.js`)

Stats, testimonials, and certification badges are no longer hardcoded in HTML — they're rendered at runtime from `window.SITE_DATA` in `js/data.js`, by `renderStats()` / `renderTestimonials()` / `renderCertifications()` in `js/main.js`. Update numbers in one file and they change everywhere they appear:

- **`stats`** — the four figures in the homepage stats bar (years experience, projects completed, sq. ft., safety incidents).
- **`testimonials`** — the homepage review carousel. Each entry is `{ quote, name, context }`.
- **`certifications`** — the badge row on both the homepage and `capabilities.html`. Each entry has a `verified` boolean; anything `false` renders with a trailing `*` (matching the "confirm before publishing" note next to it). Set `verified: true` only once you've actually confirmed that credential.

Every field in `js/data.js` is currently a placeholder — see the TODO comments in that file.

## Local SEO

- **JSON-LD on every page**: a `GeneralContractor` (LocalBusiness) block with NAP, hours, an estimated `geo` (see TODO below), and service catalog; `BreadcrumbList` on every interior page; `Service` schema for the four services on `services.html`; `FAQPage` schema on `index.html` matching the visible FAQ section; a city-scoped `GeneralContractor` block (areaServed = that city) on each `areas/*.html` page.
- **`sitemap.xml`** lists all 12 pages; **`robots.txt`** points to it. Both use the real GitHub Pages URL (`https://wesleybenoit.github.io/reddy-steady-go-website/`) — see the canonical-domain note below.
- **Geo coordinates are an estimate**, not a verified geocode (outbound geocoding APIs weren't reachable while building this). Every page has an HTML comment above its LocalBusiness script tag flagging this — verify the real lat/long via Google Maps (right-click the pin) or your Google Business Profile and update all 11 occurrences (`grep -rn "41.2110" .`).

## Performance

- **Images**: all imagery on this site is SVG (vector), not raster photos, so there's nothing to convert to WebP — the logo and illustrations are already as small and scalable as they'll get. If real photography is added later (see "Logo & imagery"), convert those specific files to WebP with explicit `width`/`height` and `loading="lazy"` on anything below the fold.
- **Scripts**: `js/data.js`, `js/forms.js`, and `js/main.js` all load with the `defer` attribute.
- **Google Maps embeds** (homepage service-area section, contact page) no longer load an iframe on page load. They show a lightweight click-to-load placeholder (`js/main.js` `initLazyMaps()`), and only fetch the actual Google Maps iframe once a visitor clicks it.
- **Preload**: `assets/logo-icon.svg` is preloaded on every page, since it's the only above-the-fold image (there's no separate hero photo — the hero is CSS/text).
- **Critical CSS**: a small hand-picked subset of the stylesheet (reset, body, `.container`, topbar/header/nav) is inlined in `<head>` on every page so there's no flash of unstyled content while `css/styles.css` finishes loading. This is a lightweight approximation, not full build-time critical-CSS extraction (this site has no build step) — if `css/styles.css` changes in a way that affects the topbar/header/nav, keep this inline block (search for "Critical above-the-fold styles") roughly in sync by hand.
- **Lighthouse**: a formal 95+ mobile score should be verified via Chrome DevTools or PageSpeed Insights against the live GitHub Pages URL once deployed — this environment's outbound network restrictions block the Google Fonts domain, so a Lighthouse run from here wouldn't reflect real-world conditions.

## Icons &amp; motion

- `assets/icons.svg` is a hand-drawn SVG sprite (`<symbol>` defs, referenced via `<use href="assets/icons.svg#icon-name">`) that replaces every emoji glyph previously used for icons — phone, star, concrete/masonry/paving/wrench, lock, dollar, home, check, shield, clipboard, briefcase, building, landmark, clock, chat. All five certification badges intentionally reuse the same `shield` icon (differentiated by label text), matching real trust-badge conventions.
- `js/main.js`'s `initScrollReveal()` fades/slides cards, stats, badges, and similar blocks into view on scroll via `IntersectionObserver`, and is a no-op if the browser has no `IntersectionObserver` support or the visitor has `prefers-reduced-motion: reduce` set. Gallery tiles and individual testimonial slides are deliberately excluded since other scripts show/hide them via `display`, which doesn't retrigger the observer.

## Accessibility

- **Landmarks**: `<header>`, one `<nav aria-label="Primary">`, `<main id="main">`, `<footer>` on every page; a skip link (first focusable element) jumps straight to `#main`. Exactly one `<h1>` per page.
- **Focus states**: every interactive element (links, buttons, form fields, `<summary>`) gets a consistent 2px red `:focus-visible` ring (see `css/styles.css`, just after the `.icon` rule) — nothing relies on an easy-to-miss browser default.
- **Forms**: every input has a real associated `<label for="">`; validation errors are announced via `role="alert"`/`role="status"` and tied to fields with `aria-invalid`.
- **Link text**: the four "Learn more →" service links per page (repeated across the homepage and all service-area pages) got `aria-label`s naming the specific service, since identical link text is a real screen-reader-navigation problem (WCAG 2.4.4).
- **Gallery "images"**: the gallery/service tiles use CSS `background-image`, not `<img>` — deliberately. A screen reader doesn't expose a CSS background as an image at all, so there's no missing "alt text" to add; the real content (e.g. "Stamped Patio — Concrete · Residential") is already in visible, readable text next to each tile. Adding `role="img"` there would make it *worse*, since screen readers treat `role="img"` elements as leaf nodes and would start ignoring that real text in favor of a shorter label.
- **Color contrast**: audited all text/background color pairs against WCAG AA. Found and fixed two real failures — the gold star rating in testimonials (2.2:1 on white) and the placeholder-note's dashed border (2.1:1) both used `--color-amber` directly on light backgrounds; both now use a new `--color-amber-dark` (5.6:1) instead. Every other pairing already passed.
- **Keyboard**: verified end-to-end with simulated Tab/Enter — logical tab order (skip link → topbar phone → logo → nav → header CTA → page content), the FAQ accordion (native `<details>`/`<summary>`), mobile nav toggle, and gallery filter buttons all operate correctly with keyboard only, no mouse.

## Logo &amp; imagery

- `assets/logo-icon.svg` — custom vector mark (trowel + level bubble in a navy/gold seal) used as the header/footer badge and the browser favicon on every page.
- `assets/illustrations/{concrete,masonry,paving,repair}.svg` — custom flat-illustration scenes standing in for real job-site photography (a house/driveway pour, a brick wall, a paved lot, a slab-repair cross-section). These are **illustrations, not photographs of actual completed work**. Swap them for real photos by replacing the `background-image: url('assets/illustrations/...')` inline style on each `.gallery-tile` / `.case-study-media` element with a real photo path.

## Confirmed business info

- Owner: Kris Reddy
- Address: 13811 L Street, Omaha, NE 68137
- Phone: (402) 415-9253
- Email: kris@pave911.com

## Placeholders to replace before launch

Search the codebase for these and swap in real content:

1. **Business hours** — `index.html` topbar (and every other page's topbar), `contact.html` hours table, and the `openingHoursSpecification` in every page's LocalBusiness JSON-LD all currently show Mon–Fri 7–5 as a placeholder. These are static per-page HTML/JSON-LD, not yet wired to `js/data.js` — update by find-and-replace across pages once real hours are confirmed (Saturday "by appointment" and Sunday "closed" aren't representable in strict `openingHoursSpecification` and are simply omitted from the schema).
2. **Testimonials** — 3 sample quotes marked "Placeholder Reviewer" in `js/data.js` (`SITE_DATA.testimonials`). Replace with real Yelp/Google reviews (with permission) — one edit, updates the homepage carousel automatically.
3. **Gallery photos** — `gallery.html`, `services.html`, and the homepage gallery preview use the custom SVG illustrations in `assets/illustrations/` instead of real photos (see "Logo & imagery" above). Add real project photos and swap each tile's `background-image` in.
4. **Company history / timeline** — `about.html` has a generic founding/growth/today timeline; replace with real dates and milestones.
5. **Canonical domain** — all pages, sitemap.xml, and robots.txt now point to the real GitHub Pages URL (`https://wesleybenoit.github.io/reddy-steady-go-website/`) instead of the never-registered `reddysteadygo.com`. If a real custom domain is set up later, do a find-and-replace for that GitHub Pages URL across all pages, `sitemap.xml`, and `robots.txt`.
6. **Social links** — Instagram link points to `https://www.instagram.com/reddy.go/` (found via search, unverified); Facebook/Yelp footer icons are `#` placeholders.
7. **By-the-numbers stats** — homepage stats bar (years in business, projects completed, sq. ft. poured, safety record) in `js/data.js` (`SITE_DATA.stats`) is placeholder; replace with real figures.
8. **Certification badges** — Bonded / OSHA 10-30 / EPA SWPPP / ADA badges in `js/data.js` (`SITE_DATA.certifications`) are marked `verified: false`, which renders them with a trailing `*` on both `index.html` and `capabilities.html`. Only flip a badge to `verified: true` once that certification is actually confirmed.
9. **Capability statement data** — `capabilities.html` uses real, standard NAICS codes (238110, 238140, 237310, 238990) but placeholder UEI, CAGE code, and bonding capacity. Register in SAM.gov and fill in real values before using this page for government/prime-contractor submissions.
10. **Leadership section** — `about.html` currently lists only Kris Reddy; add real field/office staff as the team grows.
11. **Geo coordinates** — every page's LocalBusiness JSON-LD uses an estimated lat/long for 13811 L Street (see "Local SEO" above); verify and correct.
12. **Web3Forms access key** — forms won't deliver email until a real key replaces the placeholder in `js/forms.js` (and the hidden inputs in `contact.html`/`index.html`); see "Contact form" below.

## Contact form (Web3Forms)

Both the contact page form and the homepage hero form submit via [Web3Forms](https://web3forms.com/) — a free form backend that emails submissions to whatever address you register, with no server of your own required. Logic lives in `js/forms.js`.

**Required setup before the forms will work:**

1. Go to https://web3forms.com/ and enter `kris@pave911.com`. An access key is emailed instantly — no account signup needed.
2. Open `js/forms.js` and replace `REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY` (top of the file) with that key.
3. Also replace the same placeholder string in the hidden `access_key` input in both `contact.html` and `index.html` (belt-and-suspenders — the JS sets it programmatically, but keeping the HTML in sync avoids confusion if the markup is ever submitted without JS).
4. Commit and push. Submit a test message from the live site and confirm it arrives by email (see verification steps below).

Until the real key is in place, submitting either form shows a visible "Form is not connected yet" message instead of silently failing.

**Built in:**
- Client-side validation (required fields, email format, 10-digit phone) with inline error messages
- A hidden honeypot checkbox (`name="botcheck"`) that silently no-ops the submission if a bot fills it in
- Live phone formatting to `(XXX) XXX-XXXX` as you type
- Success/error banners, with the submit button disabled and showing "Sending…" during the request

## Deploying

A GitHub Actions workflow (`.github/workflows/deploy.yml`) publishes the site to GitHub Pages on every push to `main`. Enable Pages under **Settings → Pages → Source: GitHub Actions** in the repository once created.

To preview locally:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```
