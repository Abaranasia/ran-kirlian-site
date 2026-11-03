import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Mirrors the path aliases in tsconfig.json. Only pure modules are tested, so no Astro plugin is needed.
export default defineConfig({
  resolve: {
    alias: {
      "@components": fromRoot("./src/components"),
      "@config": fromRoot("./src/config"),
      "@layouts": fromRoot("./src/layouts"),
      "@pages": fromRoot("./src/pages"),
      "@utils": fromRoot("./src/utils"),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
