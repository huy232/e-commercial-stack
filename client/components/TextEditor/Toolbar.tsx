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
import { Button } from "@/components"
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

	const editorClass = "p-1 md:p-2 rounded-md hover:bg-gray-200 transition-all"

	return (
		<>
			<div className="flex flex-wrap gap-1 md:gap-2 bg-black/30 rounded p-1 md:p-2">
				{/* Bold */}
				<Button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().toggleBold().run()
					}}
					className={clsx(
						editorClass,
						editor.isActive("bold") ? "bg-gray-800 text-white" : "text-gray-600"
					)}
					aria-pressed={editor.isActive("bold")}
					aria-label="Toggle bold text"
					role="button"
					tabIndex={0}
					data-testid="bold-text-button"
					id="bold-text-button"
				>
					<Bold className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Italic */}
				<Button
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
					aria-pressed={editor.isActive("italic")}
					aria-label="Toggle italic text"
					role="button"
					tabIndex={0}
					data-testid="italic-text-button"
					id="italic-text-button"
				>
					<Italic className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Underline */}
				<Button
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
					aria-pressed={editor.isActive("underline")}
					aria-label="Toggle underline text"
					role="button"
					tabIndex={0}
					data-testid="underline-text-button"
					id="underline-text-button"
				>
					<UnderlineIcon className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Insert/Edit Link */}
				<Button
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
					aria-pressed={editor.isActive("link")}
					aria-label="Insert or edit link"
					role="button"
					tabIndex={0}
					data-testid="insert-edit-link-button"
					id="insert-edit-link-button"
				>
					<LinkIcon className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Remove Link */}
				<Button
					type="button"
					onClick={() => editor.chain().focus().unsetLink().run()}
					className={clsx(editorClass, "text-gray-600")}
					aria-label="Remove link"
					role="button"
					tabIndex={0}
					data-testid="remove-link-button"
					id="remove-link-button"
				>
					<Link2Off className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Strikethrough */}
				<Button
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
					aria-pressed={editor.isActive("strike")}
					aria-label="Toggle strikethrough text"
					role="button"
					tabIndex={0}
					data-testid="strikethrough-text-button"
					id="strikethrough-text-button"
				>
					<Strikethrough className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Code Block */}
				<Button
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
					aria-pressed={editor.isActive("codeBlock")}
					aria-label="Toggle code block"
					role="button"
					tabIndex={0}
					data-testid="code-block-button"
					id="code-block-button"
				>
					<Code className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Bullet List */}
				<Button
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
					aria-pressed={editor.isActive("bulletList")}
					aria-label="Toggle bullet list"
					role="button"
					tabIndex={0}
					data-testid="bullet-list-button"
					id="bullet-list-button"
				>
					<List className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Ordered List */}
				<Button
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
					aria-pressed={editor.isActive("orderedList")}
					aria-label="Toggle ordered list"
					role="button"
					tabIndex={0}
					data-testid="ordered-list-button"
					id="ordered-list-button"
				>
					<ListOrdered className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Blockquote */}
				<Button
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
					aria-pressed={editor.isActive("blockquote")}
					aria-label="Toggle blockquote"
					role="button"
					tabIndex={0}
					data-testid="blockquote-button"
					id="blockquote-button"
				>
					<Quote className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Heading Level 2 */}
				<Button
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
					aria-pressed={editor.isActive("heading", { level: 2 })}
					aria-label="Toggle heading level 2"
					role="button"
					tabIndex={0}
					data-testid="heading-level-2-button"
					id="heading-level-2-button"
				>
					<Heading2 className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

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
					📷 <span className="hidden md:inline-block">Upload Images</span>
				</label>

				{/* Undo */}
				<Button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().undo().run()
					}}
					className={clsx(editorClass, "text-gray-600")}
					aria-label="Undo last action"
					role="button"
					tabIndex={0}
					data-testid="undo-button"
					id="undo-button"
				>
					<Undo2 className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>

				{/* Redo */}
				<Button
					type="button"
					onClick={(e) => {
						e.preventDefault()
						editor.chain().focus().redo().run()
					}}
					className={clsx(editorClass, "text-gray-600")}
					aria-label="Redo last action"
					role="button"
					tabIndex={0}
					data-testid="redo-button"
					id="redo-button"
				>
					<Redo2 className="w-4 h-4 lg:w-5 lg:h-5" />
				</Button>
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
								<Button
									type="button"
									onClick={() => setIsLinkModalOpen(false)}
									className="px-3 py-1 rounded bg-gray-200"
									aria-label="Cancel link insertion"
									role="button"
									tabIndex={0}
									data-testid="cancel-link-button"
									id="cancel-link-button"
								>
									Cancel
								</Button>
								<Button
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
									disabled={!linkUrl.trim()}
									aria-label="Apply link"
									role="button"
									tabIndex={0}
									data-testid="apply-link-button"
									id="apply-link-button"
								>
									Apply
								</Button>
							</div>
						</div>
					</div>,
					document.body
				)}
		</>
	)
}

export default Toolbar
