import {
	PasteRule,
	Node,
	mergeAttributes,
	type CommandProps,
} from "@tiptap/core"

declare module "@tiptap/core" {
	interface Commands<ReturnType = any> {
		youtube: {
			setYoutube: (src: string) => ReturnType
		}
	}
}

export const YouTube = Node.create({
	name: "youtube",

	group: "block",
	atom: true,

	addAttributes() {
		return {
			src: {
				default: null,
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: "iframe[src*='youtube.com'], iframe[src*='youtu.be']",
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			{ class: "youtube-embed" },
			[
				"iframe",
				mergeAttributes(HTMLAttributes, {
					width: "100%",
					height: "360",
					frameborder: "0",
					allowfullscreen: "true",
				}),
			],
		]
	},

	addCommands() {
		return {
			setYoutube:
				(src: string) =>
				({ commands }: CommandProps) => {
					return commands.insertContent({
						type: this.name,
						attrs: { src },
					})
				},
		}
	},

	addPasteRules() {
		return [
			new PasteRule({
				find: /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/g,
				handler: ({ match, range, chain }) => {
					const videoId = match[4]
					const embedUrl = `https://www.youtube.com/embed/${videoId}`

					// Remove the URL and insert the iframe
					chain().focus().deleteRange(range).setYoutube(embedUrl).run()
				},
			}),
		]
	},
})
