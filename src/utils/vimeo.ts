const vimeoHosts = new Set(["vimeo.com", "www.vimeo.com"]);
const playerHost = "player.vimeo.com";
const videoIdRegex = /^\d+$/;

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
    if (vimeoHosts.has(host)) {
        return segments.length === 1 ? segments[0] : undefined;
    }
    if (host === playerHost && segments[0] === "video") {
        return segments[1];
    }
    return undefined;
}

/** Video id of a vimeo.com/<id> or player.vimeo.com/video/<id> URL; undefined for anything else. */
export function vimeoVideoId(url: string): string | undefined {
    const parsed = parseUrl(url);
    const id = parsed ? rawVideoId(parsed) : undefined;
    return id && videoIdRegex.test(id) ? id : undefined;
}

/** Do-not-track autoplay player URL. */
export function vimeoEmbedUrl(url: string): string | undefined {
    const id = vimeoVideoId(url);
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` : undefined;
}
