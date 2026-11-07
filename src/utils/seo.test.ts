import { describe, expect, it } from "vitest";
import {
    DESCRIPTION_MAX_LENGTH,
    absoluteUrl,
    albumDescription,
    breadcrumbJsonLd,
    jsonLdDocument,
    metaDescription,
    pageTitle,
    serializeJsonLd,
    toIsoDuration,
    yearRange,
} from "./seo";
import { makeAlbum, makeTrack, utcDate } from "./test-fixtures";

describe("toIsoDuration", () => {
    it.each([
        ["3:05", "PT3M5S"],
        ["0:45", "PT45S"],
        ["10:00", "PT10M"],
        ["0:00", "PT0S"],
        ["60:00", "PT1H"],
        ["61:01", "PT1H1M1S"],
        ["130:16", "PT2H10M16S"],
    ])("converts %s to %s", (input, expected) => {
        expect(toIsoDuration(input)).toBe(expected);
    });

    it.each(["abc", "3", "3:5", "1:2:3", "1234:00", ""])("rejects %j", (input) => {
        expect(() => toIsoDuration(input)).toThrow(/Invalid track length/);
    });
});

describe("absoluteUrl", () => {
    it("resolves a path against the site URL", () => {
        expect(absoluteUrl("/albums/x/", "https://www.example.com")).toBe("https://www.example.com/albums/x/");
        expect(absoluteUrl("/", new URL("https://www.example.com"))).toBe("https://www.example.com/");
    });
});

describe("pageTitle", () => {
    it("appends the site title", () => {
        expect(pageTitle("Releases")).toBe("Releases | Ran Kirlian");
    });
});

describe("yearRange", () => {
    it("returns an empty string when there are no albums", () => {
        expect(yearRange([])).toBe("");
    });

    it("returns a single year when all releases share it", () => {
        expect(yearRange([makeAlbum({ title: "A", year: 2005 }), makeAlbum({ title: "B", year: 2005 })])).toBe("2005");
    });

    it("returns an en-dash range from the earliest to the latest year", () => {
        const albums = [2010, 2000, 2026].map((year) => makeAlbum({ title: String(year), year }));
        expect(yearRange(albums)).toBe("2000–2026");
    });
});

describe("metaDescription", () => {
    it("returns short text unchanged", () => {
        expect(metaDescription("A short description.")).toBe("A short description.");
    });

    it("truncates long text to the maximum description length", () => {
        const description = metaDescription("word ".repeat(100));
        expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX_LENGTH);
        expect(description.endsWith("…")).toBe(true);
    });
});

describe("albumDescription", () => {
    it("leads with the title and year, followed by the body excerpt", () => {
        const album = makeAlbum({ title: "Cosmos", year: 2010 }, "A deep ambient journey.\n\n## Credits\n\nSomeone.");
        expect(albumDescription(album)).toBe("Cosmos (2010): A deep ambient journey.");
    });

    it("includes collaborators in the displayed title", () => {
        const album = makeAlbum({ title: "Cosmos", year: 2010, collaborators: ["Jaja"] }, "Text.");
        expect(albumDescription(album)).toBe("Cosmos (with Jaja) (2010): Text.");
    });

    it("keeps the description within the maximum length", () => {
        const album = makeAlbum({ title: "Cosmos", year: 2010 }, "word ".repeat(100));
        expect(albumDescription(album).length).toBeLessThanOrEqual(DESCRIPTION_MAX_LENGTH);
    });

    it("falls back to a generated summary when the body is empty", () => {
        const album = makeAlbum({
            title: "Cosmos",
            year: 2010,
            author: "Ran Kirlian",
            releaseDate: utcDate("2010-05-04"),
            tracks: [makeTrack("One", "3:00"), makeTrack("Two", "4:00")],
            duration: "42:10",
        });
        expect(albumDescription(album)).toBe("Cosmos by Ran Kirlian, released 2010-05-04. 2 tracks, 42 minutes.");
    });

    it("uses the year and singular track in the fallback without a release date", () => {
        const album = makeAlbum({
            title: "Solo",
            year: 1999,
            author: "Ran Kirlian",
            tracks: [makeTrack("One", "3:00")],
            duration: "3:00",
        });
        expect(albumDescription(album)).toBe("Solo by Ran Kirlian, released 1999. 1 track, 3 minutes.");
    });
});

describe("JSON-LD helpers", () => {
    it("numbers breadcrumb items from 1 with absolute URLs", () => {
        const result = breadcrumbJsonLd(
            [{ name: "Home", path: "/" }, { name: "About", path: "/about/" }],
            "https://www.example.com"
        );
        expect(result.itemListElement).toEqual([
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.example.com/" },
            { "@type": "ListItem", position: 2, name: "About", item: "https://www.example.com/about/" },
        ]);
    });

    it("wraps a single node or an array in a @graph", () => {
        const node = { "@type": "Thing" };
        expect(jsonLdDocument(node)).toEqual({ "@context": "https://schema.org", "@graph": [node] });
        expect(jsonLdDocument([node, node])["@graph"]).toHaveLength(2);
    });

    it("escapes '<' so content cannot close the script tag", () => {
        expect(serializeJsonLd({ name: "</script>" })).toBe(String.raw`{"name":"\u003c/script>"}`);
    });
});
