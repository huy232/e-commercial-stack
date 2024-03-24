"use client"
import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Toolbar from "./Toolbar"
import Underline from "@tiptap/extension-underline"
import { Editor } from "@tiptap/react"

type TextEditorProps = {
	value: string
	onChange: (value: string) => void
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
	const [content, setContent] = useState(value)

	const editor = useEditor({
		extensions: [StarterKit, Underline],
		editorProps: {
			attributes: {
				class:
					"flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-700 text-gray-400 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none",
			},
		},
		onUpdate: ({ editor }: { editor: Editor }) => {
			setContent(editor.getHTML())
			onChange(editor.getHTML()) // Call onChange to update the parent component's state
		},
	})

	return (
		<div className="w-full px-4">
			<Toolbar editor={editor} content={content} />
			<EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
		</div>
	)
}

export default TextEditor
