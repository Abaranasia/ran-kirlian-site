// Shortens text at a word boundary, adding an ellipsis when something was cut.
export const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    const cut = text.slice(0, maxLength - 1);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.-]+$/, "")}…`;
};

// Plain text from the opening paragraphs of a Markdown/MDX body.
export const plainTextExcerpt = (markdown: string | undefined, maxLength: number): string => {
    if (!markdown) return "";
    const text = markdown
        // Only the content before the first heading (e.g. "## Credits") is the opening text.
        .split(/^#{1,6}\s/m)[0]
        .replace(/^\s*(import|export)\s.*$/gm, "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/`([^`]*)`/g, "$1")
        .replace(/(\*{1,3}|_{1,3})(\S[\s\S]*?\S|\S)\1/g, "$2")
        .replace(/^\s*(>|[-*+]|\d+\.)\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim();
    return truncate(text, maxLength);
};

// First sentence of a text, e.g. the opening sentence of the bio.
export const firstSentence = (text: string): string => {
    const match = /^[\s\S]*?[.!?](?=\s|$)/.exec(text.trim());
    return (match ? match[0] : text).trim();
};

// "1 track", "2 tracks"; pass the plural for irregular nouns, e.g. pluralize(2, "entry", "entries").
export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
    `${count} ${count === 1 ? singular : plural}`;
