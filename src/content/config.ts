import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('BestPergola Editorial'),
    category: z.string().default('Guides'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { blog };
