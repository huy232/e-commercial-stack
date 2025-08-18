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
import { CustomImage } from "@/components"
import Link from "next/link"
import { WEB_URL } from "@/constant"
import { FaShoppingBag } from "@/assets/icons"
import clsx from "clsx"

const Banner: FC = () => {
	const banners = [Banner1, Banner2, Banner3, Banner4, Banner5]
	const arrayBanner = [
		{
			heading: "Smartphone",
			description:
				"Explore the latest smartphones with cutting-edge technology, vibrant displays, and powerful performance. Perfect for staying connected and capturing every moment!",
			url: "products?category=Smartphone",
			color: "text-blue-500", // Example Tailwind color
		},
		{
			heading: "Tablet",
			description:
				"Discover versatile tablets that combine power and portability. Ideal for work, entertainment, and everything in between!",
			url: "products?category=Tablet",
			color: "text-purple-500",
		},
		{
			heading: "Smartphone overall",
			description:
				"From budget-friendly to premium devices, find the perfect smartphone that suits your style and needs. Get the best in quality and features at unbeatable prices!",
			color: "text-green-500",
		},
		{
			heading: "Delivery",
			description:
				"Fast, reliable, and free delivery on all orders. Enjoy a hassle-free shopping experience from your home to your hands in no time!",
			color: "text-orange-500",
		},
		{
			heading: "Modern e-commercial",
			description:
				"Your go-to online store for the latest tech. Experience a seamless shopping journey with top-notch customer support, secure payment options, and exclusive deals.",
			color: "text-red-500",
		},
	]

	return (
		<div className="w-full rounded px-1 overflow-hidden">
			<Swiper
				modules={[Autoplay]} // Use the Autoplay module
				spaceBetween={0} // Adjust space between slides
				loop={true} // Loop the slides infinitely
				autoplay={{ delay: 3000 }} // Auto-scroll every 3 seconds
				slidesPerView={1} // Display 1 slide at a time
			>
				{banners.map((banner, index) => (
					<SwiperSlide key={index}>
						<div className="w-full h-[220px] md:h-[330px] lg:h-[420px] relative flex items-center">
							<CustomImage
								src={banner.src}
								alt={`Banner ${index + 1}`}
								className="w-full h-full object-cover rounded absolute"
								fill
							/>
							<div className="mx-2 md:ml-6 w-full md:w-3/5 md:mt-8">
								<h3
									className={clsx(
										"font-bebasNeue font-bold text-base md:text-xl lg:text-2xl uppercase inline-block bg-clip-text backdrop-blur-2xl px-2 py-1 rounded drop-shadow-md",
										arrayBanner[index].color
									)}
								>
									{arrayBanner[index].heading}
								</h3>
								<p className="font-inter md:ml-2 mt-1 text-xs px-1 italic text-white backdrop-blur-xl rounded line-clamp-2 md:line-clamp-4">
									{arrayBanner[index].description}
								</p>
								{arrayBanner[index].url && (
									<Link
										className="text-white rounded p-1 mt-2 relative flex items-center group justify-self-start"
										href={URL + `/${arrayBanner[index].url}`}
									>
										<span className="fold-bold relative flex items-center h-full w-full rounded bg-white px-2 py-1 text-sm md:text-base font-bold text-black transition-all duration-300 bg-gradient-to-r group-hover:from-pink-500 group-hover:to-orange-500 group-hover:via-red-500 bg-size-200 bg-pos-0 hover:bg-pos-100 hover:text-white">
											Shop now
											<FaShoppingBag
												className="ml-1 group-hover:animate-tada"
												size={16}
											/>
										</span>
									</Link>
								)}
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}

export default Banner
