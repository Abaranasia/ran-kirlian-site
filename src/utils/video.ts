import { vimeoEmbedUrl } from "./vimeo";
import { youtubeEmbedUrl, youtubeThumbnailUrl, youtubeVideoId } from "./youtube";

export type VideoProvider = "youtube" | "vimeo";

export interface ResolvedVideo {
    provider: VideoProvider;
    embedUrl: string;
    /** Remote thumbnail URL, only for providers with a predictable one. */
    thumbnail?: string;
}

/** Provider, embed URL and thumbnail of a supported video URL; undefined for anything else. */
export function resolveVideo(url: string): ResolvedVideo | undefined {
    const youtubeId = youtubeVideoId(url);
    const youtubeEmbed = youtubeEmbedUrl(url);
    if (youtubeId && youtubeEmbed) {
        return { provider: "youtube", embedUrl: youtubeEmbed, thumbnail: youtubeThumbnailUrl(youtubeId) };
    }
    const vimeoEmbed = vimeoEmbedUrl(url);
    if (vimeoEmbed) {
        return { provider: "vimeo", embedUrl: vimeoEmbed };
    }
    return undefined;
}
