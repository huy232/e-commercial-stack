"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import Blockquote from "@tiptap/extension-blockquote"
import Heading from "@tiptap/extension-heading"
import Image from "@tiptap/extension-image"
import Toolbar from "./Toolbar"

const TextEditor = ({
	value,
	onChange,
	disableUploadImage = false,
}: {
	value: string
	onChange: (value: string) => void
	disableUploadImage?: boolean
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: false, // Disable StarterKit's heading
			}),
			Heading.configure({ levels: [1, 2, 3] }), // Allow H1, H2, H3
			BulletList,
			OrderedList,
			ListItem,
			Blockquote,
			Image.configure({
				inline: false,
				allowBase64: true,
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class:
					"p-1 border text-black w-full min-h-[120px] max-h-[320px] overflow-y-scroll",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
	})

	return (
		<div className="border border-gray-300 rounded-md p-2">
			{editor && (
				<Toolbar editor={editor} disableUploadImage={disableUploadImage} />
			)}
			<EditorContent editor={editor} />
		</div>
	)
}

export default TextEditor
