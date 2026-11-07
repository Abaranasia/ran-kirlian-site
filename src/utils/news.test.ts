import { describe, expect, it } from "vitest";
import { newsYear, newsYears, sortNewsByDate, upcomingReleases } from "./news";
import { makeNews, utcDate } from "./test-fixtures";

describe("newsYear", () => {
    it("uses the UTC year", () => {
        expect(newsYear(makeNews({ title: "A", date: new Date("2021-12-31T23:59:59Z") }))).toBe(2021);
        expect(newsYear(makeNews({ title: "A", date: new Date("2022-01-01T00:00:00Z") }))).toBe(2022);
    });
});

describe("sortNewsByDate", () => {
    it("orders newest first", () => {
        const sorted = sortNewsByDate([
            makeNews({ title: "Old", date: utcDate("2019-01-01") }),
            makeNews({ title: "New", date: utcDate("2023-01-01") }),
            makeNews({ title: "Mid", date: utcDate("2021-01-01") }),
        ]);
        expect(sorted.map((item) => item.data.title)).toEqual(["New", "Mid", "Old"]);
    });

    it("orders items sharing a date by title", () => {
        const sorted = sortNewsByDate([
            makeNews({ title: "Beta", date: utcDate("2020-05-05") }),
            makeNews({ title: "Alpha", date: utcDate("2020-05-05") }),
        ]);
        expect(sorted.map((item) => item.data.title)).toEqual(["Alpha", "Beta"]);
    });

    it("does not mutate its input", () => {
        const input = [
            makeNews({ title: "Old", date: utcDate("2019-01-01") }),
            makeNews({ title: "New", date: utcDate("2023-01-01") }),
        ];
        sortNewsByDate(input);
        expect(input.map((item) => item.data.title)).toEqual(["Old", "New"]);
    });
});

describe("newsYears", () => {
    it("returns each year once, newest first", () => {
        const years = newsYears([
            makeNews({ title: "A", date: utcDate("2019-03-01") }),
            makeNews({ title: "B", date: utcDate("2021-03-01") }),
            makeNews({ title: "C", date: utcDate("2019-09-01") }),
        ]);
        expect(years).toEqual([2021, 2019]);
    });

    it("returns an empty list for no news", () => {
        expect(newsYears([])).toEqual([]);
    });
});

describe("upcomingReleases", () => {
    it("keeps only upcoming items with an expected release time", () => {
        const upcoming = upcomingReleases([
            makeNews({ title: "Planned", date: utcDate("2025-06-21"), status: "upcoming", expected: "2027" }),
            // Historical "forthcoming releases" entries have no expected time and stay in the regular list.
            makeNews({ title: "Forthcoming 2007", date: utcDate("2007-01-01"), status: "upcoming" }),
            makeNews({ title: "Released", date: utcDate("2024-01-01"), status: "available", expected: "2024" }),
            makeNews({ title: "Note", date: utcDate("2024-02-01"), status: "info" }),
        ]);
        expect(upcoming.map((item) => item.data.title)).toEqual(["Planned"]);
    });

    it("orders by date ascending, then title", () => {
        const upcoming = upcomingReleases([
            makeNews({ title: "Later", date: utcDate("2026-01-01"), status: "upcoming", expected: "2028" }),
            makeNews({ title: "Beta", date: utcDate("2025-06-21"), status: "upcoming", expected: "2027" }),
            makeNews({ title: "Alpha", date: utcDate("2025-06-21"), status: "upcoming", expected: "2027" }),
        ]);
        expect(upcoming.map((item) => item.data.title)).toEqual(["Alpha", "Beta", "Later"]);
    });

    it("returns an empty list when nothing is upcoming", () => {
        expect(upcomingReleases([makeNews({ title: "Note", date: utcDate("2024-02-01") })])).toEqual([]);
    });
});
