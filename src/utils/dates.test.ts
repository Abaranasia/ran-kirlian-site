import { describe, expect, it } from "vitest";
import { formatDate, isoDate } from "./dates";

describe("formatDate", () => {
    it("formats in UTC so the day never shifts with the local timezone", () => {
        expect(formatDate(new Date("2020-03-01T00:00:00Z"))).toBe("March 1, 2020");
        expect(formatDate(new Date("2020-12-31T23:59:59Z"))).toBe("December 31, 2020");
    });
});

describe("isoDate", () => {
    it("returns the UTC calendar date as YYYY-MM-DD", () => {
        expect(isoDate(new Date("2020-03-01T00:00:00Z"))).toBe("2020-03-01");
        expect(isoDate(new Date("2020-12-31T23:59:59Z"))).toBe("2020-12-31");
    });
});
