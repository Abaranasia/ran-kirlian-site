import type { CollectionEntry } from "astro:content";

type AlbumEntry = CollectionEntry<"albums">;

// Releases without an exact date fall back to January 1st of their year.
const releaseTime = (album: AlbumEntry) =>
    (album.data.releaseDate ?? new Date(Date.UTC(album.data.year, 0, 1))).getTime();

// Collaborations show the other artists after the title, e.g. "Cosmos II (with Jaja)".
export const displayTitle = (album: AlbumEntry): string =>
    album.data.collaborators.length > 0
        ? `${album.data.title} (with ${album.data.collaborators.join(" & ")})`
        : album.data.title;

// Newest first; releases sharing a date are ordered by title.
export const sortByReleaseDate = (albums: AlbumEntry[]): AlbumEntry[] =>
    [...albums].sort(
        (a, b) => releaseTime(b) - releaseTime(a) || a.data.title.localeCompare(b.data.title)
    );

// Covers at or below this width are legacy low-resolution images. They build with a
// warning and render smaller, over a blurred copy of themselves, instead of upscaled.
export const MIN_ALBUM_COVER_WIDTH = 500;

export const isLowResCover = (album: AlbumEntry): boolean =>
    album.data.image.width <= MIN_ALBUM_COVER_WIDTH;

export const releaseTypeLabels: Record<AlbumEntry["data"]["type"], string> = {
    album: "Album",
    ep: "Mini-album",
};

export const trackCountLabel = (album: AlbumEntry): string =>
    `${album.data.tracks.length} ${album.data.tracks.length === 1 ? "track" : "tracks"}`;
