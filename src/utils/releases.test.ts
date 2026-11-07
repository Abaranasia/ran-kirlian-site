import { describe, expect, it } from "vitest";
import { MIN_ALBUM_COVER_WIDTH, displayTitle, isLowResCover, sortByReleaseDate, trackCountLabel } from "./releases";
import { makeAlbum, makeCover, makeTrack, utcDate } from "./test-fixtures";

const titles = (albums: ReturnType<typeof makeAlbum>[]) => albums.map((album) => album.data.title);

describe("displayTitle", () => {
    it("returns the plain title without collaborators", () => {
        expect(displayTitle(makeAlbum({ title: "Cosmos", year: 2010 }))).toBe("Cosmos");
    });

    it("appends collaborators joined with an ampersand", () => {
        expect(displayTitle(makeAlbum({ title: "Cosmos II", year: 2010, collaborators: ["Jaja", "Kiko"] }))).toBe(
            "Cosmos II (with Jaja & Kiko)"
        );
    });
});

describe("sortByReleaseDate", () => {
    it("orders newest first by exact release date", () => {
        const sorted = sortByReleaseDate([
            makeAlbum({ title: "Old", year: 2010, releaseDate: utcDate("2010-05-01") }),
            makeAlbum({ title: "New", year: 2010, releaseDate: utcDate("2010-09-01") }),
        ]);
        expect(titles(sorted)).toEqual(["New", "Old"]);
    });

    it("orders albums sharing a date by title", () => {
        const sorted = sortByReleaseDate([
            makeAlbum({ title: "Beta", year: 2010, releaseDate: utcDate("2010-05-01") }),
            makeAlbum({ title: "Alpha", year: 2010, releaseDate: utcDate("2010-05-01") }),
        ]);
        expect(titles(sorted)).toEqual(["Alpha", "Beta"]);
    });

    it("treats a release without a date as January 1st of its year", () => {
        const sorted = sortByReleaseDate([
            makeAlbum({ title: "Dec 2009", year: 2009, releaseDate: utcDate("2009-12-31") }),
            makeAlbum({ title: "No date 2010", year: 2010 }),
            makeAlbum({ title: "Jan 2 2010", year: 2010, releaseDate: utcDate("2010-01-02") }),
        ]);
        expect(titles(sorted)).toEqual(["Jan 2 2010", "No date 2010", "Dec 2009"]);
    });

    it("ties an undated release with an explicit January 1st release, then orders by title", () => {
        const sorted = sortByReleaseDate([
            makeAlbum({ title: "Zeta", year: 2010 }),
            makeAlbum({ title: "Alpha", year: 2010, releaseDate: utcDate("2010-01-01") }),
        ]);
        expect(titles(sorted)).toEqual(["Alpha", "Zeta"]);
    });

    it("does not mutate its input", () => {
        const input = [makeAlbum({ title: "Old", year: 2000 }), makeAlbum({ title: "New", year: 2020 })];
        sortByReleaseDate(input);
        expect(titles(input)).toEqual(["Old", "New"]);
    });
});

describe("isLowResCover", () => {
    const withWidth = (width: number) => makeAlbum({ title: "A", year: 2000, image: makeCover(width) });

    it("flags covers at or below the minimum width", () => {
        expect(isLowResCover(withWidth(MIN_ALBUM_COVER_WIDTH))).toBe(true);
        expect(isLowResCover(withWidth(300))).toBe(true);
    });

    it("accepts covers wider than the minimum", () => {
        expect(isLowResCover(withWidth(MIN_ALBUM_COVER_WIDTH + 1))).toBe(false);
    });
});

describe("trackCountLabel", () => {
    const withTracks = (count: number) =>
        makeAlbum({ title: "A", year: 2000, tracks: Array.from({ length: count }, () => makeTrack()) });

    it("pluralizes the track count", () => {
        expect(trackCountLabel(withTracks(1))).toBe("1 track");
        expect(trackCountLabel(withTracks(8))).toBe("8 tracks");
    });
});
