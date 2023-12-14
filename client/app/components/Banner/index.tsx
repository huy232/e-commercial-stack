import BannerImage from "@/assets/images/banner.png"
import { CustomImage } from "@/app/components"
import { FC } from "react"
export const Banner: FC = () => {
	return (
		<div className="w-full">
			<CustomImage
				src={BannerImage}
				alt="Banner image"
				className="h-[400px] w-full object-contain"
			/>
		</div>
	)
}
