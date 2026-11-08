import type { CollectionEntry } from "astro:content";
import { formatDate, isoDate } from "@utils/dates";

type ProductionEntry = CollectionEntry<"productions">;

// Newest first; productions sharing a date are ordered by title.
export const sortProductionsByDate = (productions: ProductionEntry[]): ProductionEntry[] =>
    [...productions].sort(
        (a, b) =>
            b.data.releaseDate.getTime() - a.data.releaseDate.getTime() ||
            a.data.title.localeCompare(b.data.title)
    );

// Display label and <time datetime> value; year-only productions show just the year.
export const productionDate = (production: ProductionEntry): { label: string; datetime: string } => {
    const { releaseDate, yearOnly } = production.data;
    if (yearOnly) {
        const year = String(releaseDate.getUTCFullYear());
        return { label: year, datetime: year };
    }
    return { label: formatDate(releaseDate), datetime: isoDate(releaseDate) };
};

// "2012–2025", a single year when all productions share it, or "" when there are none.
export const productionYearRange = (productions: ProductionEntry[]): string => {
    if (productions.length === 0) return "";
    const years = productions.map((production) => production.data.releaseDate.getUTCFullYear());
    const first = Math.min(...years);
    const last = Math.max(...years);
    return first === last ? String(first) : `${first}–${last}`;
};
