// Prints a JSON map of old rankirlian.com URLs to their new paths, for the hosting redirect setup.
// Usage: pnpm redirects:legacy > legacy-redirects.json
import { readdir, readFile } from "node:fs/promises";
import { join, parse } from "node:path";

const ALBUMS_DIR = "src/content/albums";
const NEWS_DIR = "src/content/news";

// Same id rule as Astro's glob loader (github-slugger applied to the file name).
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "")
    .replace(/ /g, "-");

const frontmatterValue = (source, key) => {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? "";
  const raw = new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m").exec(frontmatter)?.[1];
  return raw?.replace(/^(["'])(.*)\1$/, "$2");
};

const markdownFiles = async (dir) =>
  (await readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
    .map((entry) => entry.name)
    .sort();

const redirects = {
  "/index.php": "/",
  "/releases.php": "/releases/",
  "/reviews.php": "/reviews/",
  "/archive.php": "/news/",
};

const missingLegacyTitle = [];
let albumCount = 0;
for (const file of await markdownFiles(ALBUMS_DIR)) {
  const source = await readFile(join(ALBUMS_DIR, file), "utf8");
  const id = frontmatterValue(source, "slug") ?? slugify(parse(file).name);
  const legacyTitle = frontmatterValue(source, "legacyTitle");
  if (!legacyTitle) {
    missingLegacyTitle.push(id);
    continue;
  }
  redirects[`/album.php?title=${encodeURIComponent(legacyTitle)}`] = `/albums/${id}/`;
  albumCount++;
}

const years = new Set();
for (const file of await markdownFiles(NEWS_DIR)) {
  const date = frontmatterValue(await readFile(join(NEWS_DIR, file), "utf8"), "date");
  const year = date && /^\d{4}/.exec(date)?.[0];
  if (year) years.add(year);
}
for (const year of [...years].sort()) {
  redirects[`/archive.php?year=${year}`] = `/news/${year}/`;
}

console.log(JSON.stringify(redirects, null, 2));
console.error(
  `${albumCount} album redirects, ${years.size} news year redirects.` +
    (missingLegacyTitle.length > 0 ? ` Albums without legacyTitle: ${missingLegacyTitle.join(", ")}` : "")
);
