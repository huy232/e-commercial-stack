"use client"
import { Editor } from "@tiptap/react"
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Strikethrough,
	Code,
	Undo2,
	Redo2,
	List,
	ListOrdered,
	Quote,
	Heading2,
	Link as LinkIcon,
	Link2Off,
} from "lucide-react"
import clsx from "clsx"
import { useState } from "react"
import { createPortal } from "react-dom"

const Toolbar = ({ editor }: { editor: Editor }) => {
	const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
	const [linkUrl, setLinkUrl] = useState("")

	if (!editor) return null

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (!file) return

		const reader = new FileReader()
		reader.onloadend = () => {
			if (reader.result && typeof reader.result === "string") {
				editor.chain().focus().setImage({ src: reader.result }).run()
			}
		}
		reader.readAsDataURL(file)
	}

	const editorClass = "p-2 rounded-md hover:bg-gray-200 transition-all"

	return (
		<>
			<div className="flex flex-wrap gap-2 bg-black/30 rounded p-2">
				{/* Bold */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleBold().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("bold") ? "bg-gray-800 text-white" : "text-gray-600"
					)}
				>
					<Bold className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Italic */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleItalic().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("italic")
							? "bg-gray-800 text-white"
							: "text-gray-600"
					)}
				>
					<Italic className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Underline */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleUnderline().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("underline")
							? "bg-gray-800 text-white"
							: "text-gray-600"
					)}
				>
					<UnderlineIcon className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Insert/Edit Link */}
				<button
					type="button"
					onClick={() => {
						const previousUrl = editor.getAttributes("link").href
						setLinkUrl(previousUrl || "")
						setIsLinkModalOpen(true)
					}}
					className={clsx(
						editorClass,
						editor.isActive("link") ? "bg-gray-800 text-white" : "text-gray-600"
					)}
				>
					<LinkIcon className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Remove Link */}
				<button
					type="button"
					onClick={() => editor.chain().focus().unsetLink().run()}
					className={clsx(editorClass, "text-gray-600")}
				>
					<Link2Off className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Strikethrough */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleStrike().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("strike")
							? "bg-gray-800 text-white"
							: "text-gray-600"
					)}
				>
					<Strikethrough className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Code Block */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleCodeBlock().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("codeBlock")
							? "bg-gray-800 text-white"
							: "text-gray-600"
					)}
				>
					<Code className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Bullet List */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleBulletList().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("bulletList")
							? "bg-gray-800 text-white"
							: "text-gray-600"
					)}
				>
					<List className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Ordered List */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleOrderedList().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("orderedList")
							? "bg-gray-800 text-white"
							: "text-gray-600"
					)}
				>
					<ListOrdered className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Blockquote */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleBlockquote().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("blockquote")
							? "bg-gray-800 text-white"
							: "text-gray-600"
					)}
				>
					<Quote className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Heading Level 2 */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("heading", { level: 2 })
							? "bg-gray-800 text-white"
							: "text-gray-600"
					)}
				>
					<Heading2 className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Image Upload Button */}
				<input
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
					className="hidden"
					id="image-upload"
				/>
				<label
					htmlFor="image-upload"
					className="cursor-pointer px-2 py-1 bg-gray-600 text-white rounded"
				>
					📷 Upload Images
				</label>

				{/* Undo */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().undo().run()
					}}
					className={clsx(editorClass, "text-gray-600")}
				>
					<Undo2 className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>

				{/* Redo */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().redo().run()
					}}
					className={clsx(editorClass, "text-gray-600")}
				>
					<Redo2 className="w-4 h-4 lg:w-5 lg:h-5" />
				</button>
			</div>
			{isLinkModalOpen &&
				createPortal(
					<div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 h-screen my-0 space-y-0">
						<div className="bg-white rounded p-4 w-[90%] max-w-md shadow-lg space-y-4">
							<h3 className="text-lg font-semibold">Insert/Edit Link</h3>
							<input
								type="url"
								value={linkUrl}
								onChange={(e) => setLinkUrl(e.target.value)}
								placeholder="https://example.com"
								className="w-full border rounded px-3 py-2"
							/>
							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={() => setIsLinkModalOpen(false)}
									className="px-3 py-1 rounded bg-gray-200"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={() => {
										if (linkUrl) {
											editor
												.chain()
												.focus()
												.extendMarkRange("link")
												.setLink({ href: linkUrl })
												.run()
										} else {
											editor.chain().focus().unsetLink().run()
										}
										setIsLinkModalOpen(false)
									}}
									className="px-3 py-1 rounded bg-blue-600 text-white"
								>
									Apply
								</button>
							</div>
						</div>
					</div>,
					document.body
				)}
		</>
	)
}

export default Toolbar
