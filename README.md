# Reddy Steady Go LLC — Website

Enterprise-style marketing site for **Reddy Steady Go LLC**, a concrete, masonry, and commercial paving contractor based in Omaha, Nebraska (owner: Kris Reddy).

Plain HTML/CSS/JS, no build step required. Pages:

- `index.html` — home
- `services.html` — concrete, masonry, commercial paving, repair/mudjacking
- `gallery.html` — project gallery with filterable placeholder tiles
- `about.html` — company story, values, timeline
- `contact.html` — contact info, hours, map, estimate request form

## Confirmed business info

- Owner: Kris Reddy
- Address: 13811 L Street, Omaha, NE 68137
- Phone: (402) 415-9253
- Email: kris@pave911.com

## Placeholders to replace before launch

Search the codebase for these and swap in real content:

1. **Business hours** — `index.html` topbar, `contact.html` hours table (currently Mon–Fri 7–5, placeholder).
2. **Testimonials** — `index.html` testimonial section has 3 sample quotes marked "Placeholder Reviewer." Replace with real Yelp/Google reviews (with permission).
3. **Gallery photos** — `gallery.html` and the homepage gallery preview use CSS-gradient tiles instead of real photos. Add real project photos to an `images/` folder and swap each `.gallery-tile` background/`<img>` in.
4. **Company history / timeline** — `about.html` has a generic founding/growth/today timeline; replace with real dates and milestones.
5. **Canonical domain** — all pages use `https://reddysteadygo.com/` as a placeholder canonical/OG URL. Update once a real domain is chosen (or point it at the GitHub Pages URL).
6. **Social links** — Instagram link points to `https://www.instagram.com/reddy.go/` (found via search, unverified); Facebook/Yelp footer icons are `#` placeholders.

## Contact form

The estimate request forms use `mailto:` submission (opens the visitor's email client) so the site works with zero backend. For a native in-page submission, wire the `<form>` in `contact.html` and the hero form in `index.html` to a form service (e.g. Formspree, Netlify Forms) or a small serverless endpoint.

## Deploying

A GitHub Actions workflow (`.github/workflows/deploy.yml`) publishes the site to GitHub Pages on every push to `main`. Enable Pages under **Settings → Pages → Source: GitHub Actions** in the repository once created.

To preview locally:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```
