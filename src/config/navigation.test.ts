import { describe, expect, it } from "vitest";
import { isActiveNavItem, mainNavigation, type NavItem } from "./navigation";

const releases: NavItem = { label: "Releases", href: "/releases/", activePrefixes: ["/albums/"] };
const news: NavItem = { label: "News", href: "/news/" };

describe("isActiveNavItem", () => {
    it("matches the item's own path with or without a trailing slash", () => {
        expect(isActiveNavItem(news, "/news/")).toBe(true);
        expect(isActiveNavItem(news, "/news")).toBe(true);
    });

    it("matches nested paths below the item", () => {
        expect(isActiveNavItem(news, "/news/2020/")).toBe(true);
        expect(isActiveNavItem(releases, "/releases/ambient/")).toBe(true);
    });

    it("does not match a sibling that merely shares a prefix", () => {
        expect(isActiveNavItem(news, "/newsletter/")).toBe(false);
    });

    it("matches the configured active prefixes", () => {
        expect(isActiveNavItem(releases, "/albums/cosmos/")).toBe(true);
        expect(isActiveNavItem(news, "/albums/cosmos/")).toBe(false);
    });

    it("never marks external links or same-page anchors as current", () => {
        expect(isActiveNavItem({ label: "Buy", href: "https://x.test/", external: true }, "/")).toBe(false);
        expect(isActiveNavItem({ label: "Contact", href: "#contact" }, "/about/")).toBe(false);
    });

    it("treats the root item as current only on the root path", () => {
        const home: NavItem = { label: "Home", href: "/" };
        expect(isActiveNavItem(home, "/")).toBe(true);
        expect(isActiveNavItem(home, "/news/")).toBe(false);
    });
});

describe("mainNavigation", () => {
    it("ends with an external purchase link built from the given URL", () => {
        const items = mainNavigation("https://shop.test/");
        expect(items.at(-1)).toMatchObject({ label: "Purchase", href: "https://shop.test/", external: true });
    });
});
