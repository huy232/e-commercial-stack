import BannerImage from "@/assets/images/banner.png"
import { CustomImage } from "@/app/components"
import { FC } from "react"
export const Banner: FC = () => {
	return (
		<div className="w-full h-[400px] relative">
			<CustomImage
				src={BannerImage}
				alt="Banner image"
				className="w-full h-full"
			/>
		</div>
	)
}
