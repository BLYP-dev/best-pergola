import type { CostPage } from './types';
import { costFaqs } from './faqs';

export const costPages: CostPage[] = [
  {
    name: 'Pergola Cost UK',
    slug: 'pergola-cost',
    intro:
      'Pergola prices in the UK vary widely — from budget timber kits around £500–£1,500 to premium motorised louvered aluminium installations exceeding £20,000. This guide breaks down typical UK price ranges by material, roof type, size and extras, so you know what to expect before requesting quotes.',
    priceRanges: [
      { label: 'Basic wooden pergola kit (DIY)', range: '£500 – £1,500', notes: 'Excludes installation' },
      { label: 'Wooden pergola, fully installed', range: '£1,500 – £4,500' },
      { label: 'Aluminium pergola, fixed roof', range: '£4,000 – £8,000' },
      { label: 'Aluminium louvered pergola', range: '£6,000 – £12,000' },
      { label: 'Motorised louvered pergola', range: '£8,000 – £16,000' },
      { label: 'Premium build with side screens, lighting, heating', range: '£12,000 – £25,000+' },
    ],
    factors: [
      'Size (footprint and height)',
      'Material — timber, aluminium, steel or hybrid',
      'Roof type — open, fixed, louvered or motorised',
      'Foundations and groundworks required',
      'Access to the site (narrow side returns, raised gardens)',
      'Finish — paint, powder coat, stain, timber-effect',
      'Extras — lighting, heating, side screens, drainage, integrated speakers',
    ],
    extras: [
      { name: 'Integrated LED lighting', cost: '£300 – £1,200' },
      { name: 'Infrared or electric heating', cost: '£500 – £2,500' },
      { name: 'Zip-track side screens (per side)', cost: '£1,500 – £3,000' },
      { name: 'Sliding glass walls (per side)', cost: '£3,000 – £8,000' },
      { name: 'Motorisation upgrade', cost: '£1,000 – £3,000' },
      { name: 'Rain and wind sensors', cost: '£200 – £600' },
      { name: 'Concrete foundations / groundworks', cost: '£400 – £1,500' },
      { name: 'Integrated speakers and smart-home control', cost: '£400 – £1,500' },
    ],
    faqs: costFaqs,
    metaTitle: 'Pergola Cost UK 2026 | Prices by Material & Roof | BestPergola.co.uk',
    metaDescription:
      'Pergola cost UK guide — typical prices for wooden, aluminium, louvered and motorised pergolas. Installation, extras and free quotes from trusted UK installers.',
  },
  {
    name: 'Aluminium Pergola Cost',
    slug: 'aluminium-pergola-cost',
    intro:
      'Aluminium pergolas typically cost £4,000–£15,000 fully installed in the UK, depending on size, roof type, finish and extras. They cost more upfront than basic timber kits but need almost no maintenance, last 20+ years, and support louvered and motorised roof systems.',
    priceRanges: [
      { label: 'Small aluminium pergola (3m x 3m, fixed roof)', range: '£4,000 – £6,000' },
      { label: 'Mid-size aluminium louvered (3m x 4m)', range: '£6,500 – £10,000' },
      { label: 'Large aluminium louvered (4m x 5m)', range: '£9,000 – £14,000' },
      { label: 'Motorised louvered with sensors', range: '£10,000 – £18,000' },
      { label: 'Premium with lighting, heating, side screens', range: '£14,000 – £22,000+' },
    ],
    factors: [
      'Footprint — wider/deeper structures cost more per square metre',
      'Roof type — fixed, manual louvered or motorised louvered',
      'Powder coat finish (RAL colour, anthracite is most popular)',
      'Wall-mounted vs freestanding',
      'Manufacturer — premium European brands cost 30–60% more than economy ranges',
    ],
    extras: [
      { name: 'Motorisation', cost: '£1,000 – £3,000' },
      { name: 'Integrated LED lighting', cost: '£300 – £1,200' },
      { name: 'Zip-track side screens (per side)', cost: '£1,500 – £3,000' },
      { name: 'Infrared heating', cost: '£500 – £2,500' },
      { name: 'Premium powder coat (non-standard colour)', cost: '£200 – £600' },
    ],
    faqs: costFaqs,
    metaTitle: 'Aluminium Pergola Cost UK | 2026 Price Guide | BestPergola.co.uk',
    metaDescription:
      'Aluminium pergola cost UK guide. Typical prices £4,000–£15,000 installed. Compare sizes, louvered vs motorised, extras like lighting and side screens. Free quotes.',
  },
  {
    name: 'Motorised Pergola Cost',
    slug: 'motorised-pergola-cost',
    intro:
      'Motorised pergolas typically cost £8,000–£22,000+ fully installed in the UK. The motor and control system add £1,000–£3,000 on top of a manual louvered pergola, with rain and wind sensors, smart-home integration and premium controls pushing the total higher.',
    priceRanges: [
      { label: 'Entry-level motorised louvered (3m x 3m)', range: '£8,000 – £11,000' },
      { label: 'Mid-range motorised louvered (3m x 4m)', range: '£10,000 – £14,000' },
      { label: 'Large motorised louvered (4m x 5m)', range: '£13,000 – £18,000' },
      { label: 'Premium with side screens, lighting, heating', range: '£16,000 – £25,000+' },
    ],
    factors: [
      'Pergola size and number of louver bays',
      'Motor brand and quality',
      'Number of motors (one per bay vs shared)',
      'Sensor package — rain, wind, sun, temperature',
      'Smart-home integration (Alexa, Google Home, HomeKit)',
      'Mains electrical connection complexity',
    ],
    extras: [
      { name: 'Rain & wind sensors', cost: '£200 – £600' },
      { name: 'Smart-home integration module', cost: '£200 – £500' },
      { name: 'Integrated LED lighting', cost: '£300 – £1,200' },
      { name: 'Zip-track side screens (per side)', cost: '£1,500 – £3,000' },
      { name: 'Infrared heating', cost: '£500 – £2,500' },
    ],
    faqs: costFaqs,
    metaTitle: 'Motorised Pergola Cost UK | 2026 Prices | BestPergola.co.uk',
    metaDescription:
      'Motorised pergola cost UK guide. Typical prices £8,000–£22,000+ installed. Compare motor systems, sensors, smart-home options and free quotes from UK installers.',
  },
  {
    name: 'Pergola Prices UK',
    slug: 'pergola-prices-uk',
    intro:
      'Pergola prices in the UK in 2026 start around £500 for a basic DIY timber kit and reach £25,000+ for a premium motorised louvered aluminium pergola with side screens, lighting and heating. This guide shows what to budget at each tier so you can plan your project realistically.',
    priceRanges: [
      { label: 'DIY timber kit', range: '£500 – £1,500' },
      { label: 'Mid-range timber, fitted', range: '£2,000 – £4,500' },
      { label: 'Aluminium fixed roof, fitted', range: '£4,000 – £8,000' },
      { label: 'Aluminium louvered, fitted', range: '£6,000 – £12,000' },
      { label: 'Motorised louvered, fitted', range: '£8,000 – £16,000' },
      { label: 'Premium full-package builds', range: '£15,000 – £25,000+' },
    ],
    factors: [
      'Material (wood, aluminium, hybrid, steel)',
      'Roof type (open, fixed, louvered, motorised)',
      'Size and structural complexity',
      'Foundations and access',
      'Installer location and demand',
      'Time of year (peak summer = longer lead times)',
    ],
    extras: [
      { name: 'Lighting', cost: '£300 – £1,200' },
      { name: 'Heating', cost: '£500 – £2,500' },
      { name: 'Side screens (per side)', cost: '£1,500 – £3,000' },
      { name: 'Motorisation', cost: '£1,000 – £3,000' },
      { name: 'Premium foundations / decking integration', cost: '£500 – £3,000' },
    ],
    faqs: costFaqs,
    metaTitle: 'Pergola Prices UK 2026 | Full Price Guide | BestPergola.co.uk',
    metaDescription:
      'Pergola prices UK — full 2026 guide. Wooden, aluminium, louvered and motorised pergola prices, plus extras like lighting, heating and side screens. Free quotes.',
  },
];

export const costPageBySlug = (slug: string): CostPage | undefined =>
  costPages.find((p) => p.slug === slug);
