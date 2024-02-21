declare module "react-image-magnifiers-v2" {
	import { FC } from "react"

	interface GlassMagnifierProps {
		imageSrc: string
		imageAlt?: string
		className?: string
	}

	const GlassMagnifier: FC<GlassMagnifierProps>

	export { GlassMagnifier }
}
