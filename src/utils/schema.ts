import { z } from "astro/zod";

/** URL schema limited to http(s), so content links can never carry `javascript:` or `data:` payloads. */
export const httpUrl = () => z.url({ protocol: /^https?$/ });
