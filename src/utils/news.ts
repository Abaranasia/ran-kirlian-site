import type { CollectionEntry } from "astro:content";

type NewsEntry = CollectionEntry<"news">;

export const newsYear = (item: NewsEntry): number => item.data.date.getUTCFullYear();

// Newest first; items sharing a date are ordered by title.
export const sortNewsByDate = (news: NewsEntry[]): NewsEntry[] =>
    [...news].sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title)
    );

// Announced future releases with an expected release time, soonest announcement first; items sharing a date
// are ordered by title. Historical "upcoming" items without an expected time are left out.
export const upcomingReleases = (news: NewsEntry[]): NewsEntry[] =>
    news
        .filter((item) => item.data.status === "upcoming" && item.data.expected !== undefined)
        .sort((a, b) => a.data.date.getTime() - b.data.date.getTime() || a.data.title.localeCompare(b.data.title));

// News for the archive and latest lists: everything except announced upcoming releases, which have their own
// section on the news page.
export const archivedNews = (news: NewsEntry[]): NewsEntry[] => {
    const upcoming = new Set(upcomingReleases(news));
    return news.filter((item) => !upcoming.has(item));
};

// Years with at least one news item, newest first.
export const newsYears = (news: NewsEntry[]): number[] =>
    [...new Set(news.map(newsYear))].sort((a, b) => b - a);

export const newsStatusLabels: Record<NewsEntry["data"]["status"], string> = {
    available: "Available",
    upcoming: "Upcoming",
    info: "News",
};
