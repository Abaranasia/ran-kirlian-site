import { describe, expect, it } from "vitest";
import { compilationTrackTitles, compilationYearRange, sortCompilationsByDate } from "./compilations";
import { makeCompilation, utcDate } from "./test-fixtures";

const titles = (compilations: ReturnType<typeof makeCompilation>[]) =>
    compilations.map((compilation) => compilation.data.title);

describe("sortCompilationsByDate", () => {
    it("orders newest first by release date", () => {
        const sorted = sortCompilationsByDate([
            makeCompilation({ title: "Old", releaseDate: utcDate("2019-05-01") }),
            makeCompilation({ title: "New", releaseDate: utcDate("2026-05-29") }),
            makeCompilation({ title: "Middle", releaseDate: utcDate("2022-01-10") }),
        ]);
        expect(titles(sorted)).toEqual(["New", "Middle", "Old"]);
    });

    it("orders compilations sharing a date by title", () => {
        const sorted = sortCompilationsByDate([
            makeCompilation({ title: "Beta", releaseDate: utcDate("2020-05-01") }),
            makeCompilation({ title: "Alpha", releaseDate: utcDate("2020-05-01") }),
        ]);
        expect(titles(sorted)).toEqual(["Alpha", "Beta"]);
    });

    it("does not mutate its input", () => {
        const input = [
            makeCompilation({ title: "Old", releaseDate: utcDate("2000-01-01") }),
            makeCompilation({ title: "New", releaseDate: utcDate("2020-01-01") }),
        ];
        sortCompilationsByDate(input);
        expect(titles(input)).toEqual(["Old", "New"]);
    });
});

describe("compilationTrackTitles", () => {
    it("returns the title of a single track", () => {
        const compilation = makeCompilation({
            title: "A",
            releaseDate: utcDate("2020-01-01"),
            tracks: [{ title: "Those Creatures", number: 101 }],
        });
        expect(compilationTrackTitles(compilation)).toBe("Those Creatures");
    });

    it("joins several tracks with a slash in tracklist order", () => {
        const compilation = makeCompilation({
            title: "A",
            releaseDate: utcDate("2020-01-01"),
            tracks: [{ title: "Emergent Moon", number: 11 }, { title: "Oankali Parenthood", number: 10 }],
        });
        expect(compilationTrackTitles(compilation)).toBe("Oankali Parenthood / Emergent Moon");
    });

    it("keeps the listed order for tracks without a number", () => {
        const compilation = makeCompilation({
            title: "A",
            releaseDate: utcDate("2020-01-01"),
            tracks: [{ title: "Second" }, { title: "First", number: 1 }],
        });
        expect(compilationTrackTitles(compilation)).toBe("Second / First");
    });
});

describe("compilationYearRange", () => {
    const releasedOn = (...dates: string[]) =>
        dates.map((date, index) => makeCompilation({ title: `C${index}`, releaseDate: utcDate(date) }));

    it("spans the earliest to the latest release year", () => {
        expect(compilationYearRange(releasedOn("2021-03-01", "2019-12-31", "2026-05-29"))).toBe("2019–2026");
    });

    it("returns a single year when every compilation shares it", () => {
        expect(compilationYearRange(releasedOn("2020-01-01", "2020-12-31"))).toBe("2020");
    });

    it("returns an empty string without compilations", () => {
        expect(compilationYearRange([])).toBe("");
    });
});
