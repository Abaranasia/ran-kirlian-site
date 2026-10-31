export interface NavItem {
    label: string;
    href: string;
    external?: boolean;
    // Path prefixes (besides `href` itself) that mark this item as the current page.
    activePrefixes?: string[];
}

// Ordered as shown in the main navigation. The purchase link comes from the profile collection.
export const mainNavigation = (bandcampUrl: string): NavItem[] => [
    { label: "Releases", href: "/releases", activePrefixes: ["/albums/"] },
    { label: "News", href: "/news" },
    { label: "Reviews", href: "/reviews" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Purchase", href: bandcampUrl, external: true },
];

const withoutTrailingSlash = (path: string) =>
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

export const isActiveNavItem = (item: NavItem, pathname: string): boolean => {
    if (item.external) return false;
    const current = withoutTrailingSlash(pathname);
    if (current === item.href) return true;
    if (item.href !== "/" && current.startsWith(`${item.href}/`)) return true;
    return (item.activePrefixes ?? []).some((prefix) => current.startsWith(prefix));
};
