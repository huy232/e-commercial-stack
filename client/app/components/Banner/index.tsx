import BannerImage from "@/assets/images/banner.png"
import { CustomImage } from "@/app/components"
export const Banner = () => {
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
