/**
 * Single source of truth for swappable business facts.
 *
 * Update the values in this file and the homepage stats bar, testimonials,
 * and certification badges (on the homepage and the capabilities page) will
 * update everywhere they're rendered. Nothing else in the codebase should
 * hardcode these numbers/quotes/badges going forward.
 *
 * Every value below is a PLACEHOLDER pending real numbers from Kris Reddy.
 * See each field's comment for what to replace it with.
 */
window.SITE_DATA = {
  // TODO: replace with real figures. Each `verified: false` figure renders
  // with the site's placeholder styling removed only once you flip it to true.
  stats: [
    { value: "20+", label: "Years Combined Experience", verified: false },
    { value: "500+", label: "Projects Completed", verified: false },
    { value: "2M+", label: "Sq. Ft. Poured &amp; Paved", verified: false },
    { value: "0", label: "Lost-Time Safety Incidents", verified: false }
  ],

  // TODO: replace with real customer reviews (with permission), e.g. copied
  // from Yelp or Google. Keep the same {quote, name, context} shape.
  testimonials: [
    {
      quote: "Reddy Steady Go repaved our lot ahead of schedule and the crew kept the site clean the whole time. Would hire again.",
      name: "Placeholder Reviewer",
      context: "Commercial customer, Omaha",
      verified: false
    },
    {
      quote: "Our new driveway looks fantastic and held up perfectly through the winter. Fair price and great communication.",
      name: "Placeholder Reviewer",
      context: "Residential customer, Papillion",
      verified: false
    },
    {
      quote: "They rebuilt our retaining wall and it's stronger and better looking than the original. Highly recommend.",
      name: "Placeholder Reviewer",
      context: "Residential customer, Bellevue",
      verified: false
    }
  ],

  // TODO: set `verified: true` only once the certification/status is actually
  // confirmed. Unverified badges render with a trailing "*" and are listed in
  // the README's placeholder audit — don't let one go live unverified.
  certifications: [
    { label: "Licensed &amp; Insured", icon: "shield", verified: true },
    { label: "Bonded Contractor", icon: "shield", verified: false },
    { label: "OSHA 10/30 Certified", icon: "shield", verified: false },
    { label: "EPA SWPPP Compliant", icon: "shield", verified: false },
    { label: "ADA Design Familiarity", icon: "shield", verified: false }
  ],

  // TODO: confirm and replace with the real founding year.
  foundedYear: null
};
