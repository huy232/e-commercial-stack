"use client"
import { useState, useEffect } from "react"
import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Toolbar from "./Toolbar"

type TextEditorProps = {
	value: string
	onChange: (value: string) => void
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
	const [content, setContent] = useState(value)

	const editor = useEditor({
		extensions: [StarterKit, Underline],
		content: content, // Set initial content
		editorProps: {
			attributes: {
				class:
					"flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
			},
		},
		onUpdate: ({ editor }) => {
			const html = editor.getHTML()
			setContent(html)
			onChange(html)
		},
	})

	// Update editor content when value prop changes
	useEffect(() => {
		if (editor && editor.getHTML() !== value) {
			editor.commands.setContent(value)
		}
	}, [value, editor])

	return (
		<div className="w-full px-4">
			<Toolbar editor={editor} content={content} />
			<EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
		</div>
	)
}

export default TextEditor
