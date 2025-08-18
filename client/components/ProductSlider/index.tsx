"use client"
import { FC, useEffect, useState } from "react"
import Slider from "react-slick"
import { CustomImage, CustomSlider } from "@/components"
import { GlassMagnifier } from "react-image-magnifiers-v2"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css" // Import Swiper styles
import "swiper/css/navigation"
import "swiper/css/pagination"

interface ProductSliderProps {
	images: string[]
}

const ProductSlider: FC<ProductSliderProps> = ({ images }) => {
	const [displayImage, setDisplayImage] = useState(images[0])
	const handleImage = (index: number) => {
		setDisplayImage(images[index])
	}

	return (
		<div className="w-full">
			<div className="h-[120px] lg:h-[320px]">
				<GlassMagnifier
					imageSrc={displayImage}
					imageAlt="Display product image"
					className="glass-magnifier h-full"
				/>
			</div>
			<Swiper
				modules={[Navigation, Pagination]}
				spaceBetween={30}
				slidesPerView={"auto"}
				loop={true}
				navigation={true} // Enable navigation buttons
				className="mt-2 overflow-hidden w-full h-[60px] lg:h-[140px]"
			>
				{images.map((image, index) => (
					<SwiperSlide
						key={index}
						className="w-[60px] h-[60px] lg:w-[140px] lg:h-[140px] cursor-pointer"
					>
						<CustomImage
							src={image}
							alt="Sub product"
							fill
							onClick={() => handleImage(index)}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}
export default ProductSlider
