# Reddy Steady Go LLC Website

Static enterprise marketing site for **Reddy Steady Go LLC**, an Omaha, Nebraska concrete, masonry, commercial paving, parking lot maintenance, mudjacking, and concrete repair contractor led by Kris Reddy.

No build step is required. The site is plain HTML, CSS, and JavaScript.

## Pages

- `index.html` - enterprise-focused homepage with hero image, interactive project planner, service-area router, quick answers, service overview, FAQ, and procurement teaser
- `services.html` - concrete, masonry, commercial paving, parking lot maintenance, and repair service page with FAQ schema
- `capabilities.html` - procurement profile with buyer hub, print-ready capability page, core competencies, NAICS codes, differentiators, and company data
- `gallery.html` - visual guide to common project types and scope review considerations
- `about.html` - owner-led company overview and operating standards
- `contact.html` - written estimate request page with contact FAQ schema
- `areas/index.html` plus city pages for Omaha, Papillion, Bellevue, La Vista, Elkhorn, Gretna, Bennington, Ralston, Millard, and Council Bluffs
- `404.html` - branded fallback page for static hosting

## SEO And AEO Support

- Canonical URLs, meta descriptions, robots directives, theme color, Open Graph, and Twitter card metadata on every HTML page.
- Shared social preview image at `assets/photos/social-card.jpg` and homepage hero photo at `assets/photos/hero-commercial-site.jpg`.
- JSON-LD on key pages:
  - `GeneralContractor` / LocalBusiness entity on all business pages and city landing pages
  - stable `@id` for the business entity
  - `WebSite` and `WebPage` graph on the homepage
  - `WebApplication` schema for the homepage project planner
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

## Interactive Features

- Homepage project planner builds a copyable/email-ready estimate message and can prefill `contact.html`.
- Homepage service-area router sends users to the most relevant local landing page.
- Capabilities page buyer hub includes a procurement packet request link, bid intake checklist, and print button.
- Capabilities page includes a one-click company-info copy action for buyers and prime contractors.
- Desktop visitors get a page-aware quick-action dock for planning, calling, estimates, and buyer information.
- Contact forms remain static-hosting friendly: without a Web3Forms key they validate fields and open a prefilled email.
- `js/site-config.js` can enable GA4 tracking, a Google Business Profile link, Search Console verification, and Web3Forms direct form delivery without editing every page.
- `js/tracking.js` tracks phone clicks, email clicks, estimate CTA clicks, form attempts, successful lead submissions, form errors, and UTM/referrer attribution when GA4 is configured.

## Assets

- `assets/logo-rsg-full.jpg` - supplied Reddy Steady Go LLC logo used as the primary brand source
- `assets/logo-rsg-square.jpg` - optimized square version of the supplied logo for brand sharing
- `assets/logo-icon.png` - cropped shield/road mark derived from the supplied logo and used as favicon and site mark
- `assets/photos/hero-commercial-site.jpg` - generated representative homepage hero photo
- `assets/photos/social-card.jpg` - 1200x630 Open Graph/Twitter preview built around the supplied logo theme
- `assets/photos/{concrete-driveway,masonry-retaining-wall,commercial-paving,repair-leveling,project-planning}.jpg` - generated representative core service and planning photos
- `assets/photos/{stamped-patio,outdoor-fire-pit,parking-lot-striping,garage-slab}.jpg` - generated representative gallery photos for additional project types
- `assets/icons.svg` - inline SVG sprite used throughout the UI

The generated construction photos are representative visuals, not photos of completed Reddy Steady Go LLC projects.

## Items To Verify Before Production Use

- Real business hours across HTML topbars, contact page table, and JSON-LD opening hours
- Exact latitude/longitude for 13811 L Street in every LocalBusiness JSON-LD block
- Optional Web3Forms access key in `js/site-config.js` if you want direct form delivery. Without it, forms validate and open a prefilled email to `Kris@reddysteadygo.com`.
- Optional GA4 Measurement ID, Search Console verification value, and Google Business Profile URL in `js/site-config.js`
- Custom domain DNS and GitHub Pages HTTPS status
- Social profile URLs; the footer currently keeps only the Instagram link
- Any certification, registration, bonding, safety, or review claims before publishing them
- Real project photos, if available, to replace generated representative photos

## Local Preview

Open `index.html` directly in a browser, or run a simple static server from the repository root:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` publishes to GitHub Pages on pushes to `main`. Enable Pages under repository **Settings -> Pages -> Source: GitHub Actions**.

`.nojekyll` is included so GitHub Pages serves the static files as-is.
