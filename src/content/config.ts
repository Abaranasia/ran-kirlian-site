import { defineCollection, reference, z } from "astro:content";

const albumsCollection= defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        author: z.string(),
        year: z.number(),
        duration: z.string(),
        link: z.string(),
        image: image().refine( (img) => img.width > 500, {
            message: 'Image should be greater than 500px',
        }),
        tracks: z.array(z.object(
            {
                title: z.string(),
                length: z.string(),
            }
        ))

        // author: reference('author'), // Relation with Author collection
        // tags: z.array(z.string()), // Relation with tags collection
    }),
});

export const collections ={
    albums: albumsCollection,
};