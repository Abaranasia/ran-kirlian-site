import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const trackLengthRegex = /^\d{1,3}:\d{2}$/;

const albumsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/albums" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        author: z.string(),
        type: z.enum(["album", "ep"]).default("album"),
        year: z.number(),
        releaseDate: z.coerce.date().optional(),
        duration: z.string().regex(trackLengthRegex),
        bandcampUrl: z.url(),
        // The Content Layer resolves images after schema validation, so the
        // minimum cover width is enforced in src/pages/albums/[slug].astro.
        image: image(),
        tracks: z.array(z.object({
            title: z.string(),
            length: z.string().regex(trackLengthRegex, {
                error: "Track length must use the m:ss or mm:ss format",
            }),
        })),
        collaborators: z.array(z.string()).default([]),
        credits: z.array(z.object({
            role: z.string(),
            name: z.string(),
        })).default([]),
        tools: z.array(z.string()).default([]),
        series: z.array(z.enum(["ethernautica", "many-futures"])).default([]),
        tuning: z.string().optional(),
        format: z.string().optional(),
        featured: z.boolean().default(false),
        // Value of the old site `album.php?title=` parameter, kept for redirects.
        legacyTitle: z.string().optional(),
    }),
});

const newsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/news" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        date: z.coerce.date(),
        artist: z.string().default("Ran Kirlian"),
        cover: image().optional(),
        status: z.enum(["available", "upcoming", "info"]).default("info"),
        link: z.url().optional(),
        album: reference("albums").optional(),
    }),
});

const reviewsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/reviews" }),
    schema: z.object({
        album: reference("albums"),
        publication: z.string(),
        reviewer: z.string().optional(),
        date: z.coerce.date(),
        sourceUrl: z.url().optional(),
        excerpt: z.string().optional(),
    }),
});

const profileCollection = defineCollection({
    loader: file("./src/content/profile.json"),
    schema: ({ image }) => z.object({
        name: z.string(),
        tagline: z.string(),
        bio: z.string(),
        photo: image().optional(),
        email: z.email(),
        socials: z.array(z.object({
            name: z.string(),
            url: z.url(),
        })),
        bandcampUrl: z.url(),
    }),
});

export const collections = {
    albums: albumsCollection,
    news: newsCollection,
    reviews: reviewsCollection,
    profile: profileCollection,
};
