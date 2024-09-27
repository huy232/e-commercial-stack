import { CustomImage } from "@/components"
import {
	BottomBanner1,
	BottomBanner2,
	BottomBanner3,
	BottomBanner4,
} from "@/assets/images"

const Promotion = () => {
	return (
		<div className="w-full h-full">
			<video
				width="1280"
				height="720"
				autoPlay={true}
				muted={true}
				loop={true}
				preload="none"
			>
				<source src="/media/promotion.mp4" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	)
}
export default Promotion
{
	/* <CustomImage
      src={BottomBanner1}
      alt="Bottom banner 1"
      fill
      className="w-full h-full object-cover col-span-2 row-span-2"
    />

    <CustomImage
      src={BottomBanner2}
      alt="Bottom banner 2"
      fill
      className="w-full h-full object-cover col-span-1 row-span-1"
    />

    <CustomImage
      src={BottomBanner4}
      alt="Bottom banner 4"
      fill
      className="w-full h-full object-cover col-span-1 row-span-2"
    />

    <CustomImage
      src={BottomBanner3}
      alt="Bottom banner 3"
      fill
      className="w-full h-full object-cover col-span-1 row-span-1"
    />
     */
}
