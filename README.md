# Reddy Steady Go LLC Website

Static enterprise marketing site for **Reddy Steady Go LLC**, an Omaha, Nebraska concrete, masonry, commercial paving, parking lot maintenance, mudjacking, and concrete repair contractor led by Kris Reddy.

No build step is required. The site is plain HTML, CSS, and JavaScript.

## Pages

- `index.html` - enterprise-focused homepage with hero image, quick answers, service overview, FAQ, service areas, and procurement teaser
- `services.html` - concrete, masonry, commercial paving, parking lot maintenance, and repair service page with FAQ schema
- `capabilities.html` - procurement profile with core competencies, NAICS codes, differentiators, and company data
- `gallery.html` - visual guide to common project types and scope review considerations
- `about.html` - owner-led company overview and operating standards
- `contact.html` - written estimate request page with contact FAQ schema
- `areas/index.html` plus city pages for Papillion, Bellevue, La Vista, Elkhorn, and Council Bluffs

## SEO And AEO Support

- Canonical URLs, meta descriptions, robots directives, theme color, Open Graph, and Twitter card metadata on every HTML page.
- Shared social preview image at `assets/social-card.png` and homepage hero raster at `assets/enterprise-hero.png`.
- JSON-LD on key pages:
  - `GeneralContractor` / LocalBusiness entity on all business pages and city landing pages
  - stable `@id` for the business entity
  - `WebSite` and `WebPage` graph on the homepage
  - `FAQPage` schema on homepage, services, and contact pages matching visible content
  - `Service` graph on `services.html`
  - `ItemList` schema on `areas/index.html`
  - `BreadcrumbList` on interior pages
- `sitemap.xml` includes canonical page URLs and `lastmod`.
- `robots.txt` allows crawling and points to the sitemap.
- `llms.txt` provides an optional concise business summary for AI crawlers that look for it. It is supplemental; the primary AEO work is still visible content plus valid structured data.

## Shared Data

`js/data.js` contains claim-safe proof points and trust badges rendered by `js/main.js`. Do not add project counts, years in business, certifications, reviews, bonding claims, or registration identifiers unless they are verified.

`SITE_DATA.testimonials` is intentionally empty until real customer reviews are available and approved for use.

## Assets

- `assets/logo-icon.svg` - site logo/favicon
- `assets/enterprise-hero.png` - generated domain-relevant homepage hero image
- `assets/social-card.png` - 1200x630 Open Graph/Twitter image derived from the hero asset
- `assets/illustrations/*.svg` - service/project-type illustrations used below the fold
- `assets/icons.svg` - inline SVG sprite used throughout the UI

The generated hero/social image is a representative construction visual, not a photo of a completed Reddy Steady Go LLC project.

## Items To Verify Before Production Use

- Real business hours across HTML topbars, contact page table, and JSON-LD opening hours
- Exact latitude/longitude for 13811 L Street in every LocalBusiness JSON-LD block
- Web3Forms access key in `js/forms.js`, `index.html`, and `contact.html`
- Custom domain, if one replaces the current GitHub Pages URL
- Social profile URLs; footer Facebook/Yelp links are still `#`
- Any certification, registration, bonding, safety, or review claims before publishing them
- Real project photos, if available, to replace illustrative service tiles

## Local Preview

Open `index.html` directly in a browser, or run a simple static server from the repository root:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` publishes to GitHub Pages on pushes to `main`. Enable Pages under repository **Settings -> Pages -> Source: GitHub Actions**.
