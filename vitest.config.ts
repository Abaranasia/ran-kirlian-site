import { defineConfig } from "vitest/config";

// Path aliases come from tsconfig.json. Only pure modules are tested, so no Astro plugin is needed.
export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    test: {
        include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    },
});
