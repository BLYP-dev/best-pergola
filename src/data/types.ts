export type FAQ = {
  q: string;
  a: string;
};

export type County = {
  name: string;
  slug: string;
  intro: string;
  towns: string[]; // town slugs
  nearbyCounties: string[]; // county slugs
  metaTitle: string;
  metaDescription: string;
};

export type Town = {
  name: string;
  slug: string;
  county: string; // county name
  countySlug: string;
  intro: string;
  nearbyTowns: string[]; // town slugs within same county
  metaTitle: string;
  metaDescription: string;
};

export type Service = {
  name: string;
  slug: string;
  description: string;
  bestFor: string;
  costRange: string;
  installTime: string;
  pros: string[];
  cons: string[];
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
};

export type CostPage = {
  name: string;
  slug: string;
  intro: string;
  priceRanges: { label: string; range: string; notes?: string }[];
  factors: string[];
  extras: { name: string; cost: string }[];
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
};

export type GuidePage = {
  name: string;
  slug: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
};
