export function cleanText(text?: string): string {
    if (!text) return "";
    return text
        // Remove basic HTML if present
        .replace(/<[^>]*>?/gm, "")
        // Remove excess spaces
        .replace(/\s+/g, " ")
        .trim();
}
