import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const post = defineCollection({
	// Load Markdown and MDX files in the `src/content/post/` directory.
	loader: glob({ base: './src/content/post', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object (support both pubDate and published/date)
			pubDate: z.coerce.date().optional(),
			published: z.coerce.date().optional(),
			date: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			image: z.string().optional(),
			tags: z.array(z.string()).optional(),
			category: z.string().optional(),
			author: z.string().optional(),
			pinned: z.boolean().optional().default(false),
			priority: z.number().optional(),
			draft: z.boolean().optional().default(false),
		}),
});

const spec = defineCollection({
	// Load Markdown and MDX files in the `src/content/spec/` directory.
	loader: glob({ base: './src/content/spec', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
		}),
});

export const collections = { post, spec };
