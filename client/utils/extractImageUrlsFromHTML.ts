export function extractImageUrlsFromHTML(html: string): string[] {
	if (typeof document === "undefined") return [] // SSR-safe

	const container = document.createElement("div")
	container.innerHTML = html

	const images = Array.from(container.querySelectorAll("img"))
	return images
		.map((img) => img.getAttribute("src"))
		.filter((src): src is string => typeof src === "string" && src.length > 0)
}
