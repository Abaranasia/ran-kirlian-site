import type { CollectionEntry } from "astro:content";

type AlbumEntry = CollectionEntry<"albums">;
type NewsEntry = CollectionEntry<"news">;
type ReviewEntry = CollectionEntry<"reviews">;
type CompilationEntry = CollectionEntry<"compilations">;
type AlbumCover = AlbumEntry["data"]["image"];
type AlbumTrack = AlbumEntry["data"]["tracks"][number];

// Plain objects standing in for content collection entries; only the fields the helpers read are modelled.
export const makeAlbum = (
    data: Partial<AlbumEntry["data"]> & { title: string; year: number },
    body?: string
): AlbumEntry =>
    ({
        id: data.title.toLowerCase().replace(/\s+/g, "-"),
        body,
        data: { collaborators: [], tracks: [], duration: "0:00", type: "album", ...data },
    }) as unknown as AlbumEntry;

export const makeNews = (data: { title: string; date: Date }): NewsEntry =>
    ({ id: data.title, data }) as unknown as NewsEntry;

export const makeReview = (data: { publication: string; date: Date }): ReviewEntry =>
    ({ id: data.publication, data }) as unknown as ReviewEntry;

export const makeCompilation = (data: {
    title: string;
    releaseDate: Date;
    tracks?: CompilationEntry["data"]["tracks"];
}): CompilationEntry => ({
    id: data.title.toLowerCase().replace(/\s+/g, "-"),
    collection: "compilations",
    data: {
        label: "Label",
        url: "https://example.bandcamp.com/album/compilation",
        cover: makeCover(1200),
        tracks: [{ title: "Track" }],
        ...data,
    },
});

export const makeCover =(width: number): AlbumCover => ({ src: "/cover.jpg", width, height: width, format: "jpg" });

export const makeTrack = (title = "Track", length = "3:00"): AlbumTrack => ({ title, length });

export const utcDate = (iso: string): Date => new Date(`${iso}T00:00:00Z`);
