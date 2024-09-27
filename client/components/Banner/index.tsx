"use client"
import { FC } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import Banner1 from "@/assets/images/introduce-banner/banner1.jpg"
import Banner2 from "@/assets/images/introduce-banner/banner2.jpg"
import Banner3 from "@/assets/images/introduce-banner/banner3.jpg"
import Banner4 from "@/assets/images/introduce-banner/banner4.jpg"
import Banner5 from "@/assets/images/introduce-banner/banner5.jpg"
import "swiper/css" // Import Swiper styles
import { Autoplay } from "swiper/modules"
import { CustomImage } from ".."

const Banner: FC = () => {
	const banners = [Banner1, Banner2, Banner3, Banner4, Banner5]

	return (
		<div className="w-full">
			<Swiper
				modules={[Autoplay]} // Use the Autoplay module
				spaceBetween={30} // Adjust space between slides
				loop={true} // Loop the slides infinitely
				autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-scroll every 3 seconds
				slidesPerView={1} // Display 1 slide at a time
			>
				{banners.map((banner, index) => (
					<SwiperSlide key={index}>
						<CustomImage
							src={banner.src}
							alt={`Banner ${index + 1}`}
							className="w-full h-[420px] object-cover"
							fill
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}

export default Banner
