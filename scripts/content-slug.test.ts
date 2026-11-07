import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { slugify } from "./content-slug.mjs";

// The slugger Astro's glob loader uses to derive entry ids from file names.
const astroRequire = createRequire(createRequire(import.meta.url).resolve("astro/package.json"));
const { slug: astroSlug } = (await import(pathToFileURL(astroRequire.resolve("github-slugger")).href)) as {
    slug: (value: string) => string;
};

describe("slugify", () => {
    it("is the slug function Astro uses for content entry ids", () => {
        expect(slugify).toBe(astroSlug);
    });

    it.each([
        ["Cosmos Vol. I", "cosmos-vol-i"],
        ["Música Cósmica", "música-cósmica"],
        ["Ñandú & Friends!", "ñandú--friends"],
        ["Many Futures: Part 2", "many-futures-part-2"],
        ["UPPER case", "upper-case"],
        ["two  spaces", "two--spaces"],
    ])("turns %j into %j", (input, expected) => {
        expect(slugify(input)).toBe(expected);
        expect(slugify(input)).toBe(astroSlug(input));
    });
});
