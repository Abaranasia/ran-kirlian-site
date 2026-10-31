import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const albumsCollection = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/albums" }),
    schema: ({ image }) => z.object({
        title: z.string(),
        author: z.string(),
        year: z.number(),
        duration: z.string(),
        link: z.string(),
        // The Content Layer resolves images after schema validation, so the
        // minimum cover width is enforced in src/pages/albums/[slug].astro.
        image: image(),
        tracks: z.array(z.object({
            title: z.string(),
            length: z.string(),
        })),
    }),
});

export const collections = {
    albums: albumsCollection,
};
