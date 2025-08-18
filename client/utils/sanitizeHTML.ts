import sanitizeHtml from "sanitize-html"
export function sanitizeHTML(description: string): string {
	return sanitizeHtml(description, {
		allowedTags: ["b", "i", "em", "strong", "a", "p", "br"],
		allowedAttributes: {
			a: ["href"],
		},
		disallowedTagsMode: "discard",
	})
}
