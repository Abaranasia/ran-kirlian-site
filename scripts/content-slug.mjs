// Content entry ids for Node scripts, derived exactly as Astro's glob loader does: github-slugger
// applied to the file name. github-slugger is resolved through Astro's own dependencies, so the
// script always uses the same function (and version) as the site build.
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const astroRequire = createRequire(createRequire(import.meta.url).resolve("astro/package.json"));

/** @type {(value: string) => string} */
export const { slug: slugify } = await import(pathToFileURL(astroRequire.resolve("github-slugger")).href);
