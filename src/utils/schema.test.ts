import { describe, expect, it } from "vitest";
import { httpUrl } from "./schema";

describe("httpUrl", () => {
    it.each(["https://rankirlian.bandcamp.com/album/limbo", "http://alteraorbe.es/"])(
        "accepts the web URL %s",
        (url) => {
            expect(httpUrl().safeParse(url).success).toBe(true);
        }
    );

    it.each([
        "javascript:alert(1)",
        "data:text/html,x",
        "ftp://example.com/file",
        "mailto:someone@example.com",
        "not a url",
    ])("rejects %s", (url) => {
        expect(httpUrl().safeParse(url).success).toBe(false);
    });
});
