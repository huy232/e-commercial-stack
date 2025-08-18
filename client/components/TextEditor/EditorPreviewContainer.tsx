"use client"
import dynamic from "next/dynamic"
import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from "react"
import EditorComponent from "./EditorComponent"
import { arraysAreEqual } from "@/utils"
const PreviewComponent = dynamic(() => import("./PreviewComponent"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-full">
			<span className="text-gray-500">Loading...</span>
		</div>
	),
})

interface EditorPreviewProps {
	initialContent?: string
	onContentChange?: (content: string) => void
	images: string[]
	onImageChange: (images: string[]) => void
}

const EditorPreviewContainer = forwardRef(
	(
		{
			initialContent = "",
			onContentChange,
			images,
			onImageChange,
		}: EditorPreviewProps,
		ref
	) => {
		const [, forceUpdate] = useState(0)

		const editorRef = useRef<{
			clearEditor: () => void
			insertImage: (url: string) => void
			getEditorContent: () => string
			removeImageBySrc: (src: string) => void // ✅ Add this
		} | null>(null)

		const extractImageUrls = (html: string): string[] => {
			if (typeof window === "undefined") return []
			const parser = new DOMParser()
			const doc = parser.parseFromString(html, "text/html")
			const imgElements = Array.from(doc.querySelectorAll("img"))
			return imgElements.map((img) => img.src)
		}
		const contentRef = useRef(initialContent)

		useImperativeHandle(ref, () => ({
			clear: () => {
				contentRef.current = ""
				onContentChange?.("")
				onImageChange([])
				editorRef.current?.clearEditor()
			},
			getContent: () => contentRef.current.trim(),
			getLocalImages: () => {
				return extractImageUrls(contentRef.current).filter((src) =>
					src.startsWith("blob:")
				)
			},
		}))

		const handleContentChange = useCallback(
			(newContent: string) => {
				contentRef.current = newContent
				onContentChange?.(newContent)

				const newImages = Array.from(new Set(extractImageUrls(newContent)))

				if (!arraysAreEqual(newImages, images)) {
					onImageChange(newImages)
				}
				forceUpdate((n) => n + 1)
			},
			[onContentChange, onImageChange, images]
		)

		const handleRemoveImage = useCallback(
			(src: string) => {
				const newImages = images.filter((img) => img !== src)
				onImageChange(newImages)

				// Remove from Tiptap directly
				editorRef.current?.removeImageBySrc(src)

				URL.revokeObjectURL(src)
			},
			[images, onImageChange]
		)

		return (
			<div className="space-y-4 my-4 editor-content">
				<EditorComponent
					initialContent={contentRef.current}
					onContentChange={handleContentChange}
					ref={editorRef}
				/>

				<PreviewComponent
					content={contentRef.current}
					localImages={images}
					onRemoveImage={handleRemoveImage}
				/>
			</div>
		)
	}
)

EditorPreviewContainer.displayName = "EditorPreviewContainer"
export default React.memo(EditorPreviewContainer)
