import type { CollectionEntry } from "astro:content";

export interface ReleaseCategory {
    slug: string;
    label: string;
    matches: (album: CollectionEntry<"albums">) => boolean;
}

// Ordered as shown in the releases navigation. A release may match several categories.
export const releaseCategories: ReleaseCategory[] = [
    {
        slug: "full-length",
        label: "Full-length albums",
        matches: (album) => album.data.type === "album",
    },
    {
        slug: "mini-albums",
        label: "Mini-albums",
        matches: (album) => album.data.type === "ep",
    },
    {
        slug: "ethernautica",
        label: "Ethernautica series",
        matches: (album) => album.data.series.includes("ethernautica"),
    },
    {
        slug: "many-futures",
        label: "Many Futures series",
        matches: (album) => album.data.series.includes("many-futures"),
    },
];
