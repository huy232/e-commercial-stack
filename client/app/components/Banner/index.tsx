import { CustomImage } from "@/app/components"
import { HomeBanner } from "@/assets/images"
import { FC } from "react"
export const Banner: FC = () => {
	return (
		<div className="w-full h-[400px] relative">
			<CustomImage
				src={HomeBanner}
				alt="Banner image"
				className="w-full h-full"
			/>
		</div>
	)
}
