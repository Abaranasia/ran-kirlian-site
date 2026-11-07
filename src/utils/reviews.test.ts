import { describe, expect, it } from "vitest";
import { sortReviewsByDate } from "./reviews";
import { makeReview, utcDate } from "./test-fixtures";

describe("sortReviewsByDate", () => {
    it("orders newest first", () => {
        const sorted = sortReviewsByDate([
            makeReview({ publication: "Old", date: utcDate("2010-01-01") }),
            makeReview({ publication: "New", date: utcDate("2020-01-01") }),
        ]);
        expect(sorted.map((review) => review.data.publication)).toEqual(["New", "Old"]);
    });

    it("orders reviews sharing a date by publication", () => {
        const sorted = sortReviewsByDate([
            makeReview({ publication: "Zine", date: utcDate("2015-06-01") }),
            makeReview({ publication: "Blog", date: utcDate("2015-06-01") }),
        ]);
        expect(sorted.map((review) => review.data.publication)).toEqual(["Blog", "Zine"]);
    });
});
