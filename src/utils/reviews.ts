import type { CollectionEntry } from "astro:content";

type ReviewEntry = CollectionEntry<"reviews">;

// Newest first; reviews sharing a date are ordered by publication.
export const sortReviewsByDate = (reviews: ReviewEntry[]): ReviewEntry[] =>
    [...reviews].sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.publication.localeCompare(b.data.publication)
    );
