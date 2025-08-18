export const extractImageUrlsFromHTML = (html: string): string[] => {
	if (typeof window === "undefined") return []

	const parser = new DOMParser()
	const doc = parser.parseFromString(html, "text/html")
	const imgs = doc.querySelectorAll("img")
	return Array.from(imgs).map((img) => img.src)
}
