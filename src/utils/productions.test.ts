import { describe, expect, it } from "vitest";
import { productionDate, productionYearRange, sortProductionsByDate } from "./productions";
import { makeProduction, utcDate } from "./test-fixtures";

const titles = (productions: ReturnType<typeof makeProduction>[]) =>
    productions.map((production) => production.data.title);

describe("sortProductionsByDate", () => {
    it("orders newest first by release date", () => {
        const sorted = sortProductionsByDate([
            makeProduction({ title: "Old", releaseDate: utcDate("2012-10-10") }),
            makeProduction({ title: "New", releaseDate: utcDate("2025-09-01") }),
            makeProduction({ title: "Middle", releaseDate: utcDate("2014-12-28") }),
        ]);
        expect(titles(sorted)).toEqual(["New", "Middle", "Old"]);
    });

    it("orders productions sharing a date by title", () => {
        const sorted = sortProductionsByDate([
            makeProduction({ title: "Nostromo Diaries", releaseDate: utcDate("2012-01-01"), yearOnly: true }),
            makeProduction({ title: "Gaze", releaseDate: utcDate("2012-01-01"), yearOnly: true }),
        ]);
        expect(titles(sorted)).toEqual(["Gaze", "Nostromo Diaries"]);
    });

    it("does not mutate its input", () => {
        const input = [
            makeProduction({ title: "Old", releaseDate: utcDate("2000-01-01") }),
            makeProduction({ title: "New", releaseDate: utcDate("2020-01-01") }),
        ];
        sortProductionsByDate(input);
        expect(titles(input)).toEqual(["Old", "New"]);
    });
});

describe("productionDate", () => {
    it("shows the full date and ISO day for dated productions", () => {
        const production = makeProduction({ title: "A", releaseDate: utcDate("2013-11-30") });
        expect(productionDate(production)).toEqual({ label: "November 30, 2013", datetime: "2013-11-30" });
    });

    it("shows only the year for year-only productions", () => {
        const production = makeProduction({ title: "A", releaseDate: utcDate("2012-01-01"), yearOnly: true });
        expect(productionDate(production)).toEqual({ label: "2012", datetime: "2012" });
    });
});

describe("productionYearRange", () => {
    const releasedOn = (...dates: string[]) =>
        dates.map((date, index) => makeProduction({ title: `P${index}`, releaseDate: utcDate(date) }));

    it("spans the earliest to the latest release year", () => {
        expect(productionYearRange(releasedOn("2013-01-16", "2012-10-10", "2025-09-01"))).toBe("2012–2025");
    });

    it("returns a single year when every production shares it", () => {
        expect(productionYearRange(releasedOn("2012-01-01", "2012-10-10"))).toBe("2012");
    });

    it("returns an empty string without productions", () => {
        expect(productionYearRange([])).toBe("");
    });
});
