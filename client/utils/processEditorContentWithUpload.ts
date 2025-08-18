import { API } from "@/constant"
import { extractImageUrlsFromHTML } from "@/utils/"

interface ProcessEditorResult {
	description: string
	error?: string
	removedImages?: string[]
	currentCloudImages?: string[]
}

export const processEditorContentWithUpload = async (
	editorRef: React.RefObject<{
		clear: () => void
		getContent: () => string
		getLocalImages: () => string[]
	}>,
	prevCloudImages: string[] = [] // ← pass old cloud URLs for update
): Promise<ProcessEditorResult> => {
	if (!editorRef.current) {
		return { description: "", error: "Editor is not ready" }
	}

	let description = editorRef.current.getContent()
	const localImages = editorRef.current.getLocalImages()

	if (!description.trim()) {
		return {
			description: "",
			error: "Please enter a description for the product",
		}
	}

	// Handle upload of new local images
	if (localImages.length > 0) {
		const uploadFormData = new FormData()

		await Promise.all(
			localImages.map(async (blobUrl, index) => {
				const response = await fetch(blobUrl)
				const blob = await response.blob()
				const file = new File([blob], `image-${index}.png`, { type: blob.type })
				uploadFormData.append("images", file)
			})
		)

		try {
			const res = await fetch(API + "/upload-image", {
				method: "POST",
				body: uploadFormData,
				credentials: "include",
			})
			const result = await res.json()

			if (!result.success) {
				return { description: "", error: "Failed to upload images" }
			}

			const uploadedUrls: string[] = result.images

			localImages.forEach((localUrl, idx) => {
				description = description.replace(localUrl, uploadedUrls[idx])
			})
		} catch (err) {
			console.error("Error uploading description images:", err)
			return { description: "", error: "Error uploading images" }
		}
	}

	// 🔥 Detect removed images
	const currentCloudImages = extractImageUrlsFromHTML(description).filter(
		(url) => url.startsWith("https://res.cloudinary.com/")
	)
	const removedImages =
		prevCloudImages?.length > 0
			? prevCloudImages.filter(
					(prev) =>
						prev.startsWith("https://res.cloudinary.com/") &&
						!currentCloudImages.includes(prev)
			  )
			: []

	return { description, removedImages, currentCloudImages }
}
