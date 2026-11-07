import { describe, expect, it } from "vitest";
import { vimeoEmbedUrl, vimeoVideoId } from "./vimeo";

describe("vimeoVideoId", () => {
    it("reads the id from a vimeo.com URL", () => {
        expect(vimeoVideoId("https://vimeo.com/1356476")).toBe("1356476");
        expect(vimeoVideoId("http://vimeo.com/978216")).toBe("978216");
    });

    it("reads the id from a www.vimeo.com URL with extra parameters", () => {
        expect(vimeoVideoId("http://www.vimeo.com/1476605?pg=embed&sec=1476605")).toBe("1476605");
    });

    it("reads the id from a player.vimeo.com embed URL", () => {
        expect(vimeoVideoId("https://player.vimeo.com/video/2621909")).toBe("2621909");
        expect(vimeoVideoId("https://player.vimeo.com/video/3368680?autoplay=1")).toBe("3368680");
    });

    it("returns undefined for non-Vimeo URLs", () => {
        expect(vimeoVideoId("https://www.youtube.com/watch?v=ofsjLhmOzSo")).toBeUndefined();
        expect(vimeoVideoId("https://notvimeo.com/1356476")).toBeUndefined();
    });

    it("returns undefined for Vimeo URLs without a numeric video id", () => {
        expect(vimeoVideoId("https://vimeo.com/")).toBeUndefined();
        expect(vimeoVideoId("https://vimeo.com/channels/staffpicks")).toBeUndefined();
        expect(vimeoVideoId("https://player.vimeo.com/1356476")).toBeUndefined();
    });

    it("returns undefined for invalid URLs", () => {
        expect(vimeoVideoId("not a url")).toBeUndefined();
    });
});

describe("vimeoEmbedUrl", () => {
    it("builds a do-not-track autoplay player URL", () => {
        expect(vimeoEmbedUrl("https://vimeo.com/1356476"))
            .toBe("https://player.vimeo.com/video/1356476?autoplay=1&dnt=1");
    });

    it("returns undefined for non-Vimeo URLs", () => {
        expect(vimeoEmbedUrl("https://youtu.be/O6LCDhmv4c8")).toBeUndefined();
    });
});
