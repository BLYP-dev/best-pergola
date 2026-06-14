import { SITE } from './site';
import type { FAQ } from '../data/types';

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
});

export const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
});

export const faqLd = (faqs: FAQ[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const serviceLd = (opts: {
  name: string;
  description: string;
  areaServed?: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: opts.name,
  provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  areaServed: opts.areaServed ?? 'United Kingdom',
  description: opts.description,
  url: opts.url,
});

export const localAreaLd = (opts: {
  name: string;
  description: string;
  url: string;
  areaName: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Pergola installation matching service',
  provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  areaServed: { '@type': 'AdministrativeArea', name: opts.areaName, addressCountry: 'GB' },
  description: opts.description,
  url: opts.url,
  name: opts.name,
});
