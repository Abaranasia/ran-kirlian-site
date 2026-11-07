const youtubeHosts = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"]);
const shortHosts = new Set(["youtu.be", "www.youtu.be"]);
const videoIdRegex = /^[\w-]{6,}$/;

function parseUrl(url: string): URL | undefined {
    try {
        return new URL(url);
    } catch {
        return undefined;
    }
}

function rawVideoId(parsed: URL): string | undefined {
    const host = parsed.hostname.toLowerCase();
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (shortHosts.has(host)) {
        return segments[0];
    }
    if (!youtubeHosts.has(host)) {
        return undefined;
    }
    if (segments[0] === "watch") {
        return parsed.searchParams.get("v") ?? undefined;
    }
    if (segments[0] === "embed") {
        return segments[1];
    }
    return undefined;
}

/** Video id of a youtube.com/watch, youtu.be or embed URL; undefined for anything else. */
export function youtubeVideoId(url: string): string | undefined {
    const parsed = parseUrl(url);
    const id = parsed ? rawVideoId(parsed) : undefined;
    return id && videoIdRegex.test(id) ? id : undefined;
}

/** Start time in seconds from a `t=1286s` or `t=1286` parameter, if present. */
export function youtubeStartSeconds(url: string): number | undefined {
    const match = /^(\d+)s?$/.exec(parseUrl(url)?.searchParams.get("t") ?? "");
    return match ? Number(match[1]) : undefined;
}

export function youtubeThumbnailUrl(id: string): string {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Privacy-enhanced autoplay embed URL that keeps the original start time. */
export function youtubeEmbedUrl(url: string): string | undefined {
    const id = youtubeVideoId(url);
    if (!id) {
        return undefined;
    }
    const start = youtubeStartSeconds(url);
    const startParam = start === undefined ? "" : `&start=${start}`;
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1${startParam}`;
}
