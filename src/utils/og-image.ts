import type { ImageMetadata } from "astro";
import { getImage } from "astro:assets";

export const OG_IMAGE_MAX_WIDTH = 1200;

export interface OgImage {
    url: string;
    width?: number;
    height?: number;
}

// Absolute URL of a JPEG rendition for social previews, never wider than the original.
export const toOgImage = async (image: ImageMetadata | string, site: URL | string): Promise<OgImage> => {
    if (typeof image === "string") {
        return { url: new URL(image, site).href };
    }
    const width = Math.min(image.width, OG_IMAGE_MAX_WIDTH);
    const height = Math.round((image.height * width) / image.width);
    const result = await getImage({ src: image, width, height, format: "jpeg", quality: 85 });
    return { url: new URL(result.src, site).href, width, height };
};
