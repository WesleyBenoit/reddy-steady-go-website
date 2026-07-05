# Reddy Steady Go LLC — Website

Enterprise-style marketing site for **Reddy Steady Go LLC**, a concrete, masonry, and commercial paving contractor based in Omaha, Nebraska (owner: Kris Reddy).

Plain HTML/CSS/JS, no build step required. Pages:

- `index.html` — home, with a by-the-numbers stats bar, certification badges, and a capabilities/government-contracting teaser
- `services.html` — concrete, masonry, commercial paving, repair/mudjacking
- `capabilities.html` — capability statement: core competencies, differentiators, NAICS/UEI/CAGE/bonding data, certifications, core markets (residential/commercial/municipal)
- `gallery.html` — featured case studies plus a filterable project gallery
- `about.html` — company story, leadership, values, timeline
- `contact.html` — contact info, hours, map, estimate request form

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

1. **Business hours** — `index.html` topbar, `contact.html` hours table (currently Mon–Fri 7–5, placeholder).
2. **Testimonials** — `index.html` testimonial section has 3 sample quotes marked "Placeholder Reviewer." Replace with real Yelp/Google reviews (with permission).
3. **Gallery photos** — `gallery.html`, `services.html`, and the homepage gallery preview use the custom SVG illustrations in `assets/illustrations/` instead of real photos (see "Logo & imagery" above). Add real project photos and swap each tile's `background-image` in.
4. **Company history / timeline** — `about.html` has a generic founding/growth/today timeline; replace with real dates and milestones.
5. **Canonical domain** — all pages use `https://reddysteadygo.com/` as a placeholder canonical/OG URL. Update once a real domain is chosen (or point it at the GitHub Pages URL).
6. **Social links** — Instagram link points to `https://www.instagram.com/reddy.go/` (found via search, unverified); Facebook/Yelp footer icons are `#` placeholders.
7. **By-the-numbers stats** — `index.html` stats bar (years in business, projects completed, sq. ft. poured, safety record) is placeholder; replace with real figures.
8. **Certification badges** — Bonded / OSHA 10-30 / EPA SWPPP / ADA badges on `index.html` and `capabilities.html` are marked with `*` because certification status is unverified. Only keep a badge live once the certification is actually confirmed.
9. **Capability statement data** — `capabilities.html` uses real, standard NAICS codes (238110, 238140, 237310, 238990) but placeholder UEI, CAGE code, and bonding capacity. Register in SAM.gov and fill in real values before using this page for government/prime-contractor submissions.
10. **Leadership section** — `about.html` currently lists only Kris Reddy; add real field/office staff as the team grows.

## Contact form

The estimate request forms use `mailto:` submission (opens the visitor's email client) so the site works with zero backend. For a native in-page submission, wire the `<form>` in `contact.html` and the hero form in `index.html` to a form service (e.g. Formspree, Netlify Forms) or a small serverless endpoint.

## Deploying

A GitHub Actions workflow (`.github/workflows/deploy.yml`) publishes the site to GitHub Pages on every push to `main`. Enable Pages under **Settings → Pages → Source: GitHub Actions** in the repository once created.

To preview locally:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```
