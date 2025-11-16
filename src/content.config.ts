import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categories } from '@data/categories';

// Extract category slugs for the enum (slugs are used in frontmatter)
const categorySlugs = categories.map((category) => category.slug);

const blog = defineCollection({
    loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string(),
        featuredImage: z.string().optional(),
        publishDate: z.string().transform((str) => new Date(str)),
        publish: z.boolean().optional(),
        categories: z.array(z.enum(categorySlugs as [string, ...string[]])).optional(),
        tags: z.array(z.string()).optional(),
        seo: z
            .object({
                title: z.string().optional(),
                description: z.string().optional(),
                image: z.string().optional(),
            })
            .optional(),
    }),
});

const team = defineCollection({
    loader: glob({ base: './src/content/team', pattern: '**/*.md' }),
    schema: ({ image }) =>
        z.object({
            name: z.string(),
            headshot: image().optional(),
            jobTitle: z.string(),
            email: z.string().optional(),
            linkedin: z.string().url().optional(),
            linkedinUsername: z.string().optional(),
            xSocial: z.string().url().optional(),
            xSocialUsername: z.string().optional(),
            github: z.string().url().optional(),
            githubUsername: z.string().optional(),
            order: z.number().default(999),
            publish: z.boolean().default(true),
        }),
});

const legal = defineCollection({
    loader: glob({ base: './src/content/legal', pattern: '**/*.md' }),
    schema: z.object({
        title: z.string(),
        lastUpdated: z.string().transform((str) => new Date(str)),
        seo: z
            .object({
                title: z.string().optional(),
                description: z.string().optional(),
            })
            .optional(),
    }),
});

const page = defineCollection({
    loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        publish: z.boolean().default(true),
        seo: z
            .object({
                title: z.string().optional(),
                description: z.string().optional(),
            })
            .optional(),
    }),
});

const service = defineCollection({
    loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
    schema: z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        icon: z.string().optional(),
        link: z.string().optional(),
        order: z.number().default(0),
    }),
});

const video = defineCollection({
    loader: glob({ base: './src/content/videos', pattern: '**/*.md' }),
    schema: z.object({
        title: z.string(),
        videoUrl: z.string(),
        category: z.string().optional(),
        thumbnail: z.string().optional(),
    }),
});

const banner = defineCollection({
    loader: glob({ base: './src/content/banners', pattern: '**/*.md' }),
    schema: z.object({
        title: z.string(),
        image: z.string(),
        link: z.string().optional(),
        order: z.number().default(0),
        active: z.boolean().default(true),
    }),
});

const feature = defineCollection({
    loader: glob({ base: './src/content/features', pattern: '**/*.md' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(), // Icon name as string (e.g., 'users', 'calendar', 'shield')
        order: z.number().default(0),
        active: z.boolean().default(true),
    }),
});

const homepage = defineCollection({
    loader: glob({ base: './src/content/homepage', pattern: '**/*.md' }),
    schema: z.object({
        title: z.string(),
        hero: z.object({
            heroTitle: z.string(),
            heroDescription: z.string(),
            heroImage: z.string().optional(),
            heroOverlayOpacity: z.number().default(0.3),
            heroButton1Text: z.string(),
            heroButton1Link: z.string(),
            heroButton2Text: z.string(),
            heroButton2Link: z.string(),
        }),
        features: z.object({
            featuresEyebrow: z.string(),
            featuresTitle: z.string(),
            featuresDescription: z.string(),
            featuresButtonText: z.string(),
            featuresButtonLink: z.string(),
        }),
        mainCta: z.object({
            mainCtaEyebrow: z.string(),
            mainCtaTitle: z.string(),
            mainCtaDescription: z.string(),
            mainCtaButtonText: z.string(),
            mainCtaButtonLink: z.string(),
        }),
        footerCta: z.object({
            footerCtaEyebrow: z.string(),
            footerCtaTitle: z.string(),
            footerCtaDescription: z.string(),
            footerCtaButtonText: z.string(),
            footerCtaButtonLink: z.string(),
        }),
        recentPosts: z.object({
            recentPostsEyebrow: z.string(),
            recentPostsTitle: z.string(),
            recentPostsDescription: z.string(),
            recentPostsButtonText: z.string(),
            recentPostsButtonLink: z.string(),
            recentPostsCount: z.number().default(6),
        }),
        seo: z.object({
            seoTitle: z.string(),
            seoDescription: z.string(),
        }),
    }),
});

export const collections = { blog, team, legal, page, service, video, banner, feature, homepage };
