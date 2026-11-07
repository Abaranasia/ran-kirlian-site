import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteConfig } from "./site-config";

const themeToken = (name: string): string | undefined => {
    const css = readFileSync(new URL("../styles/styles.css", import.meta.url), "utf8");
    const theme = /@theme\s*\{([\s\S]*?)\}/.exec(css)?.[1] ?? "";
    return new RegExp(`--${name}:\\s*([^;]+);`).exec(theme)?.[1].trim();
};

describe("siteConfig.themeColor", () => {
    it("matches the page background token in the @theme block", () => {
        expect(siteConfig.themeColor).toBe(themeToken("color-ground"));
    });
});
