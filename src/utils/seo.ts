import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@config/site-config";
import { isoDate } from "@utils/dates";
import { displayTitle } from "@utils/releases";

type AlbumEntry = CollectionEntry<"albums">;
type ProfileEntry = CollectionEntry<"profile">;
type ReviewEntry = CollectionEntry<"reviews">;

export type JsonLd = Record<string, unknown>;

export const DESCRIPTION_MAX_LENGTH = 155;

export const absoluteUrl = (path: string, site: URL | string): string => new URL(path, site).href;

// Stable identifier shared by every JSON-LD node that refers to the artist.
export const artistId = (site: URL | string): string => absoluteUrl("/#artist", site);

const websiteId = (site: URL | string): string => absoluteUrl("/#website", site);

// "m:ss", "mm:ss" or "mmm:ss" to an ISO 8601 duration, e.g. "130:16" -> "PT2H10M16S".
export const toIsoDuration = (length: string): string => {
    const match = /^(\d{1,3}):(\d{2})$/.exec(length);
    if (!match) {
        throw new Error(`Invalid track length "${length}": expected m:ss`);
    }
    const totalMinutes = Number(match[1]);
    const seconds = Number(match[2]);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const parts = [
        hours > 0 ? `${hours}H` : "",
        minutes > 0 ? `${minutes}M` : "",
        seconds > 0 || (hours === 0 && minutes === 0) ? `${seconds}S` : "",
    ];
    return `PT${parts.join("")}`;
};

// Shortens text at a word boundary, adding an ellipsis when something was cut.
export const truncate = (text: string, maxLength = DESCRIPTION_MAX_LENGTH): string => {
    if (text.length <= maxLength) return text;
    const cut = text.slice(0, maxLength - 1);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.-]+$/, "")}…`;
};

// Plain text from the opening paragraphs of a Markdown/MDX body, for meta descriptions.
export const plainTextExcerpt = (markdown: string | undefined, maxLength = DESCRIPTION_MAX_LENGTH): string => {
    if (!markdown) return "";
    const text = markdown
        // Only the content before the first heading (e.g. "## Credits") describes the release.
        .split(/^#{1,6}\s/m)[0]
        .replace(/^\s*(import|export)\s.*$/gm, "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/`([^`]*)`/g, "$1")
        .replace(/(\*{1,3}|_{1,3})(\S[\s\S]*?\S|\S)\1/g, "$2")
        .replace(/^\s*(>|[-*+]|\d+\.)\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim();
    return truncate(text, maxLength);
};

// First sentence of a text, e.g. the opening sentence of the bio.
export const firstSentence = (text: string): string => {
    const match = /^[\s\S]*?[.!?](?=\s|$)/.exec(text.trim());
    return (match ? match[0] : text).trim();
};

const durationLabel = (length: string): string => {
    const [minutes] = length.split(":").map(Number);
    return `${minutes} minutes`;
};

// Series volumes share their opening paragraph, so the title and year lead to keep descriptions unique.
export const albumDescription = (album: AlbumEntry): string => {
    const prefix = `${displayTitle(album)} (${album.data.year}): `;
    const excerpt = plainTextExcerpt(album.body, DESCRIPTION_MAX_LENGTH - prefix.length);
    if (excerpt) return `${prefix}${excerpt}`;
    const { author, releaseDate, year, tracks, duration } = album.data;
    const released = releaseDate ? isoDate(releaseDate) : String(year);
    const trackCount = `${tracks.length} ${tracks.length === 1 ? "track" : "tracks"}`;
    return truncate(`${displayTitle(album)} by ${author}, released ${released}. ${trackCount}, ${durationLabel(duration)}.`);
};

// "2000–2026", or a single year when all releases share it.
export const yearRange = (albums: AlbumEntry[]): string => {
    const years = albums.map((album) => album.data.year);
    const first = Math.min(...years);
    const last = Math.max(...years);
    return first === last ? String(first) : `${first}–${last}`;
};

interface ArtistJsonLdOptions {
    profile: ProfileEntry;
    site: URL | string;
    imageUrl?: string;
}

export const artistJsonLd = ({ profile, site, imageUrl }: ArtistJsonLdOptions): JsonLd => {
    const { name, tagline, socials, bandcampUrl } = profile.data;
    return {
        "@type": "MusicGroup",
        "@id": artistId(site),
        name,
        url: absoluteUrl("/", site),
        ...(imageUrl ? { image: imageUrl } : {}),
        description: `${tagline} based in ${siteConfig.location}.`,
        genre: siteConfig.genres,
        foundingLocation: { "@type": "Place", name: siteConfig.location },
        sameAs: [...socials.map((social) => social.url), bandcampUrl],
    };
};

export const websiteJsonLd = (site: URL | string): JsonLd => ({
    "@type": "WebSite",
    "@id": websiteId(site),
    name: siteConfig.title,
    url: absoluteUrl("/", site),
    inLanguage: "en",
    publisher: { "@id": artistId(site) },
});

export const profilePageJsonLd = (path: string, site: URL | string): JsonLd => ({
    "@type": "ProfilePage",
    url: absoluteUrl(path, site),
    isPartOf: { "@id": websiteId(site) },
    mainEntity: { "@id": artistId(site) },
});

export interface Breadcrumb {
    name: string;
    path: string;
}

export const breadcrumbJsonLd = (items: Breadcrumb[], site: URL | string): JsonLd => ({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path, site),
    })),
});

const reviewJsonLd = (review: ReviewEntry): JsonLd => ({
    "@type": "Review",
    author: { "@type": "Organization", name: review.data.publication },
    datePublished: isoDate(review.data.date),
    ...(review.data.excerpt ? { reviewBody: review.data.excerpt } : {}),
    ...(review.data.sourceUrl ? { url: review.data.sourceUrl } : {}),
});

interface AlbumJsonLdOptions {
    album: AlbumEntry;
    path: string;
    site: URL | string;
    imageUrl: string;
    reviews?: ReviewEntry[];
}

export const albumJsonLd = ({ album, path, site, imageUrl, reviews = [] }: AlbumJsonLdOptions): JsonLd => {
    const { releaseDate, year, tracks, collaborators, type, bandcampUrl } = album.data;
    const url = absoluteUrl(path, site);
    return {
        "@type": "MusicAlbum",
        "@id": `${url}#album`,
        name: displayTitle(album),
        url,
        image: imageUrl,
        description: albumDescription(album),
        byArtist: [
            { "@id": artistId(site) },
            ...collaborators.map((name) => ({ "@type": "MusicGroup", name })),
        ],
        datePublished: releaseDate ? isoDate(releaseDate) : String(year),
        albumProductionType: "https://schema.org/StudioAlbum",
        albumReleaseType: type === "ep" ? "https://schema.org/EPRelease" : "https://schema.org/AlbumRelease",
        numTracks: tracks.length,
        track: {
            "@type": "ItemList",
            numberOfItems: tracks.length,
            itemListElement: tracks.map((track, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                    "@type": "MusicRecording",
                    name: track.title,
                    duration: toIsoDuration(track.length),
                },
            })),
        },
        sameAs: bandcampUrl,
        ...(reviews.length > 0 ? { review: reviews.map(reviewJsonLd) } : {}),
    };
};

// Wraps one or more nodes in a single @graph document.
export const jsonLdDocument = (nodes: JsonLd | JsonLd[]): JsonLd => ({
    "@context": "https://schema.org",
    "@graph": Array.isArray(nodes) ? nodes : [nodes],
});

// JSON for an inline <script>; "<" is escaped so content can never close the tag.
export const serializeJsonLd = (data: JsonLd): string => JSON.stringify(data).replace(/</g, "\\u003c");
