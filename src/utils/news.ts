import type { CollectionEntry } from "astro:content";

type NewsEntry = CollectionEntry<"news">;

export const newsYear = (item: NewsEntry): number => item.data.date.getUTCFullYear();

// Newest first; items sharing a date are ordered by title.
export const sortNewsByDate = (news: NewsEntry[]): NewsEntry[] =>
    [...news].sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title)
    );

// Years with at least one news item, newest first.
export const newsYears = (news: NewsEntry[]): number[] =>
    [...new Set(news.map(newsYear))].sort((a, b) => b - a);

export const newsStatusLabels: Record<NewsEntry["data"]["status"], string> = {
    available: "Available",
    upcoming: "Upcoming",
    info: "News",
};
