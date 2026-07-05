/**
 * Single source of truth for shared proof points.
 *
 * Keep this file claim-safe: only publish metrics, reviews, certifications,
 * or registrations after they are verified. Enterprise buyers and search
 * systems both reward clear, consistent business facts over filler numbers.
 */
window.SITE_DATA = {
  stats: [
    { value: "Written", label: "Scope &amp; Estimate", verified: true },
    { value: "Insured", label: "Coverage Available", verified: true },
    { value: "NAICS", label: "Trade Classifications", verified: true },
    { value: "Metro", label: "Omaha Service Area", verified: true }
  ],

  testimonials: [],

  certifications: [
    { label: "Licensed &amp; Insured", icon: "shield", verified: true },
    { label: "Written Scope", icon: "clipboard", verified: true },
    { label: "Owner-Led Estimates", icon: "briefcase", verified: true },
    { label: "COI Available", icon: "shield", verified: true },
    { label: "Omaha Metro Contractor", icon: "pin", verified: true }
  ],

  foundedYear: null
};
