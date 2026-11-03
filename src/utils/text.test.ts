import { describe, expect, it } from "vitest";
import { firstSentence, pluralize, plainTextExcerpt, truncate } from "./text";

describe("truncate", () => {
    it("returns short text unchanged", () => {
        expect(truncate("Short text", 50)).toBe("Short text");
    });

    it("cuts at a word boundary and adds an ellipsis", () => {
        expect(truncate("The quick brown fox jumps over the lazy dog", 20)).toBe("The quick brown…");
    });

    it("never exceeds the maximum length", () => {
        expect(truncate("The quick brown fox jumps over the lazy dog", 20).length).toBeLessThanOrEqual(20);
    });

    it("hard-cuts when the only space is too early in the text", () => {
        expect(truncate("Supercalifragilistic word", 12)).toBe("Supercalifr…");
    });

    it("drops trailing punctuation before the ellipsis", () => {
        expect(truncate("Hello, world, and everyone else", 14)).toBe("Hello, world…");
    });
});

describe("plainTextExcerpt", () => {
    it("returns an empty string for a missing or empty body", () => {
        expect(plainTextExcerpt(undefined, 100)).toBe("");
        expect(plainTextExcerpt("", 100)).toBe("");
    });

    it("keeps only the content before the first heading", () => {
        expect(plainTextExcerpt("Intro text.\n\n## Credits\n\nWritten by someone.", 100)).toBe("Intro text.");
    });

    it("strips MDX imports, exports and code fences", () => {
        const body = "import Foo from './Foo.astro'\nexport const x = 1\n\n```js\nconst a = 1;\n```\n\nReal text.";
        expect(plainTextExcerpt(body, 100)).toBe("Real text.");
    });

    it("strips HTML/JSX tags", () => {
        expect(plainTextExcerpt("Some <em>emphasised</em> text <Player id=\"1\" />.", 100)).toBe("Some emphasised text .");
    });

    it("drops images and keeps link text", () => {
        expect(plainTextExcerpt("![cover](a.jpg)See [the label](https://x.test) now.", 100)).toBe("See the label now.");
    });

    it("unwraps inline code, bold and italics", () => {
        expect(plainTextExcerpt("A `code` **bold** and _italic_ word.", 100)).toBe("A code bold and italic word.");
    });

    it("removes list and quote markers and collapses whitespace", () => {
        expect(plainTextExcerpt("- one\n- two\n\n> quoted\n\n1. first", 100)).toBe("one two quoted first");
    });

    it("truncates to the requested length", () => {
        expect(plainTextExcerpt("word ".repeat(50), 20).length).toBeLessThanOrEqual(20);
    });
});

describe("firstSentence", () => {
    it("returns the first sentence of several", () => {
        expect(firstSentence("First one. Second one.")).toBe("First one.");
    });

    it("supports ! and ? terminators", () => {
        expect(firstSentence("Really? Yes.")).toBe("Really?");
        expect(firstSentence("Wow! More.")).toBe("Wow!");
    });

    it("does not split on a period inside a word or number", () => {
        expect(firstSentence("Version 2.0 is out. Next.")).toBe("Version 2.0 is out.");
    });

    it("returns the whole trimmed text when there is no terminator", () => {
        expect(firstSentence("  No terminator here  ")).toBe("No terminator here");
    });
});

describe("pluralize", () => {
    it("uses the singular form for exactly one", () => {
        expect(pluralize(1, "track")).toBe("1 track");
    });

    it("uses the plural form for zero and many", () => {
        expect(pluralize(0, "track")).toBe("0 tracks");
        expect(pluralize(12, "track")).toBe("12 tracks");
    });

    it("accepts an explicit plural for irregular nouns", () => {
        expect(pluralize(2, "entry", "entries")).toBe("2 entries");
        expect(pluralize(1, "entry", "entries")).toBe("1 entry");
    });
});
