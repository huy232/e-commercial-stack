"use client"
import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import Blockquote from "@tiptap/extension-blockquote"
import Heading from "@tiptap/extension-heading"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Toolbar from "./Toolbar"
import { YouTube } from "./Youtube"

interface EditorProps {
	initialContent: string
	onContentChange: (content: string) => void
}

const EditorComponent = forwardRef(
	({ initialContent = "", onContentChange }: EditorProps, ref) => {
		const editorRef = useRef<HTMLDivElement>(null)

		const editor = useEditor({
			extensions: [
				StarterKit.configure({ heading: false }),
				Heading.configure({ levels: [1, 2, 3] }),
				BulletList,
				OrderedList,
				ListItem,
				Blockquote,
				Underline,
				Image,
				YouTube,
				Link.configure({
					openOnClick: false,
					autolink: false,
					linkOnPaste: false,
				}),
			],
			content: initialContent,
			editorProps: {
				attributes: {
					class:
						"min-h-[180px] max-h-[640px] resize-y overflow-auto p-2 border text-black w-full bg-gray-100 rounded-md [&_img]:max-h-64 [&_img]:h-auto [&_img]:mx-auto",
				},
			},
			onUpdate: ({ editor }) => {
				onContentChange(editor.getHTML())
			},
			immediatelyRender: false,
			injectCSS: true,
			autofocus: false,
			editable: true,
		})

		useImperativeHandle(ref, () => ({
			clearEditor: () => {
				editor?.commands.clearContent()
				onContentChange("")
			},
			insertImage: (url: string) => {
				editor?.commands.setImage({ src: url })
				onContentChange(editor?.getHTML() || "")
			},
			getEditorContent: () => editor?.getHTML() || "",

			// 👇 New method to remove image by its src
			removeImageBySrc: (src: string) => {
				if (!editor) return

				editor.commands.command(({ tr, state }) => {
					const { doc } = state
					const imagePositions: number[] = []

					doc.descendants((node, pos) => {
						if (node.type.name === "image" && node.attrs.src === src) {
							imagePositions.push(pos)
						}
					})

					// 🔁 Delete from end to start to prevent position shifts
					imagePositions
						.sort((a, b) => b - a)
						.forEach((pos) => {
							tr.delete(pos, pos + 1)
						})

					if (imagePositions.length > 0) {
						editor.view.dispatch(tr)
						return true
					}

					return false
				})

				onContentChange(editor?.getHTML() || "")
			},
		}))

		// ✅ Handle drag-and-drop image upload
		const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault()
			if (!editor) return

			const files = event.dataTransfer.files
			if (!files || files.length === 0) return

			for (let i = 0; i < files.length; i++) {
				const objectURL = URL.createObjectURL(files[i])
				editor.commands.setImage({ src: objectURL })
			}
		}

		return (
			<>
				<h2 className="font-bold">Editor</h2>
				{editor && <Toolbar editor={editor} />}

				{/* Editor with Drag-and-Drop support */}
				<div
					ref={editorRef}
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDrop}
					className="prose mt-2 border rounded-md p-2 bg-gray-100"
				>
					<EditorContent editor={editor} />
				</div>
			</>
		)
	}
)

EditorComponent.displayName = "EditorComponent"
export default React.memo(EditorComponent)
