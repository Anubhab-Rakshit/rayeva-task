"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanText = cleanText;
function cleanText(text) {
    if (!text)
        return "";
    return text
        .replace(/<[^>]*>?/gm, "")
        .replace(/\s+/g, " ")
        .trim();
}
