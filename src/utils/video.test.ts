import { describe, expect, it } from "vitest";
import { resolveVideo } from "./video";

describe("resolveVideo", () => {
    it("resolves a YouTube URL with its embed URL and remote thumbnail", () => {
        expect(resolveVideo("https://www.youtube.com/watch?v=IoOfVJeJNqc&t=1286s")).toEqual({
            provider: "youtube",
            embedUrl: "https://www.youtube-nocookie.com/embed/IoOfVJeJNqc?autoplay=1&start=1286",
            thumbnail: "https://i.ytimg.com/vi/IoOfVJeJNqc/hqdefault.jpg",
        });
    });

    it("resolves a Vimeo URL with its embed URL and no thumbnail", () => {
        expect(resolveVideo("https://vimeo.com/1356476")).toEqual({
            provider: "vimeo",
            embedUrl: "https://player.vimeo.com/video/1356476?autoplay=1&dnt=1",
        });
    });

    it("returns undefined for unsupported URLs", () => {
        expect(resolveVideo("https://example.com/video/1")).toBeUndefined();
        expect(resolveVideo("not a url")).toBeUndefined();
    });
});
