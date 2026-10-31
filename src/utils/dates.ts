// Content dates are parsed as UTC midnight, so format in UTC to avoid an off-by-one day.
export const formatDate = (date: Date): string =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

// Machine-readable value for <time datetime>.
export const isoDate = (date: Date): string => date.toISOString().slice(0, 10);
