import { CustomImage } from "@/components"
import {
	BottomBanner1,
	BottomBanner2,
	BottomBanner3,
	BottomBanner4,
} from "@/assets/images"

const Promotion = () => {
	return (
		<div className="w-full md:w-2/3">
			<video
				width="1280"
				height="720"
				autoPlay={true}
				muted={true}
				loop={true}
				preload="none"
				className="rounded"
				playsInline
				webkit-playsinline="true"
				controls={false}
			>
				<source src="/media/promotion.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	)
}
export default Promotion
