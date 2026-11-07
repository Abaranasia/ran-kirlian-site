import type { CollectionEntry } from "astro:content";

type CompilationEntry = CollectionEntry<"compilations">;

// Newest first; compilations sharing a date are ordered by title.
export const sortCompilationsByDate = (compilations: CompilationEntry[]): CompilationEntry[] =>
    [...compilations].sort(
        (a, b) =>
            b.data.releaseDate.getTime() - a.data.releaseDate.getTime() ||
            a.data.title.localeCompare(b.data.title)
    );

// Ran Kirlian's track titles on a compilation, in tracklist order when every track is numbered.
export const compilationTrackTitles = (compilation: CompilationEntry): string => {
    const { tracks } = compilation.data;
    const ordered = tracks.every((track) => track.number !== undefined)
        ? [...tracks].sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
        : tracks;
    return ordered.map((track) => track.title).join(" / ");
};

// "2019–2026", a single year when all compilations share it, or "" when there are none.
export const compilationYearRange = (compilations: CompilationEntry[]): string => {
    if (compilations.length === 0) return "";
    const years = compilations.map((compilation) => compilation.data.releaseDate.getUTCFullYear());
    const first = Math.min(...years);
    const last = Math.max(...years);
    return first === last ? String(first) : `${first}–${last}`;
};
