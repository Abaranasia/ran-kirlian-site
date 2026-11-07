import { describe, expect, it } from "vitest";
import { youtubeEmbedUrl, youtubeStartSeconds, youtubeThumbnailUrl, youtubeVideoId } from "./youtube";

describe("youtubeVideoId", () => {
    it("reads the id from a youtube.com watch URL", () => {
        expect(youtubeVideoId("https://www.youtube.com/watch?v=ofsjLhmOzSo")).toBe("ofsjLhmOzSo");
    });

    it("reads the id from a watch URL with extra parameters", () => {
        expect(youtubeVideoId("https://www.youtube.com/watch?v=IoOfVJeJNqc&t=1286s")).toBe("IoOfVJeJNqc");
        expect(youtubeVideoId("https://youtube.com/watch?feature=share&v=_CSkkGQxEoM")).toBe("_CSkkGQxEoM");
    });

    it("reads the id from a youtu.be short URL", () => {
        expect(youtubeVideoId("https://youtu.be/O6LCDhmv4c8?t=593")).toBe("O6LCDhmv4c8");
    });

    it("reads the id from an embed URL", () => {
        expect(youtubeVideoId("https://www.youtube.com/embed/r20aRsCMFS8")).toBe("r20aRsCMFS8");
        expect(youtubeVideoId("https://www.youtube-nocookie.com/embed/r20aRsCMFS8?start=5")).toBe("r20aRsCMFS8");
    });

    it("returns undefined for non-YouTube URLs", () => {
        expect(youtubeVideoId("https://vimeo.com/123456")).toBeUndefined();
        expect(youtubeVideoId("https://notyoutube.com/watch?v=ofsjLhmOzSo")).toBeUndefined();
    });

    it("returns undefined for YouTube URLs without a video id", () => {
        expect(youtubeVideoId("https://www.youtube.com/")).toBeUndefined();
        expect(youtubeVideoId("https://www.youtube.com/watch")).toBeUndefined();
    });

    it("returns undefined for invalid URLs", () => {
        expect(youtubeVideoId("not a url")).toBeUndefined();
    });
});

describe("youtubeStartSeconds", () => {
    it("reads t= with and without the seconds suffix", () => {
        expect(youtubeStartSeconds("https://www.youtube.com/watch?v=IoOfVJeJNqc&t=1286s")).toBe(1286);
        expect(youtubeStartSeconds("https://www.youtube.com/watch?v=IoOfVJeJNqc&t=1286")).toBe(1286);
    });

    it("returns undefined without a valid t= parameter", () => {
        expect(youtubeStartSeconds("https://www.youtube.com/watch?v=IoOfVJeJNqc")).toBeUndefined();
        expect(youtubeStartSeconds("https://www.youtube.com/watch?v=IoOfVJeJNqc&t=abc")).toBeUndefined();
    });
});

describe("youtubeThumbnailUrl", () => {
    it("builds the hqdefault thumbnail URL", () => {
        expect(youtubeThumbnailUrl("ofsjLhmOzSo")).toBe("https://i.ytimg.com/vi/ofsjLhmOzSo/hqdefault.jpg");
    });
});

describe("youtubeEmbedUrl", () => {
    it("builds a privacy-enhanced autoplay embed URL", () => {
        expect(youtubeEmbedUrl("https://www.youtube.com/watch?v=YWHXJL0-4Ig"))
            .toBe("https://www.youtube-nocookie.com/embed/YWHXJL0-4Ig?autoplay=1");
    });

    it("preserves the start time from t=", () => {
        expect(youtubeEmbedUrl("https://www.youtube.com/watch?v=IoOfVJeJNqc&t=1286s"))
            .toBe("https://www.youtube-nocookie.com/embed/IoOfVJeJNqc?autoplay=1&start=1286");
        expect(youtubeEmbedUrl("https://youtu.be/O6LCDhmv4c8?t=593"))
            .toBe("https://www.youtube-nocookie.com/embed/O6LCDhmv4c8?autoplay=1&start=593");
    });

    it("returns undefined for non-YouTube URLs", () => {
        expect(youtubeEmbedUrl("https://vimeo.com/123456")).toBeUndefined();
    });
});
