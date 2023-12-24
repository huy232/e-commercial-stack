import { CustomImage } from "@/app/components"
import { HomeBanner } from "@/assets/images"
import { FC } from "react"
const Banner: FC = () => {
	return (
		<div className="w-full">
			<CustomImage src={HomeBanner} alt="Banner image" />
		</div>
	)
}

export default Banner
