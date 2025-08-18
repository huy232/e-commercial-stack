"use client"
import { ProductCard } from "@/components"
import { ProductExtraType, ProductType } from "@/types"
import { FC } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css" // Import Swiper styles
import "swiper/css/navigation"
import "swiper/css/pagination"

interface CustomSliderProps {
	products: ProductExtraType[] | null
	slideToShow?: number
	headingTitle?: string
	headingClassName?: string
	headingTabClassName?: string
	supportHover?: boolean
	supportDetail?: boolean
	markLabel?: string
}

const CustomSlider: FC<CustomSliderProps> = ({
	products,
	slideToShow = 3,
	headingTitle,
	headingClassName,
	headingTabClassName,
	supportHover = false,
	supportDetail,
	markLabel,
}) => {
	return (
		<Swiper
			modules={[Navigation, Pagination]}
			// spaceBetween={30}
			slidesPerView={"auto"}
			loop={true}
			navigation={true} // Enable navigation buttons
			className="mt-2 overflow-hidden w-full"
		>
			{products &&
				products.map((item: ProductExtraType) => (
					<SwiperSlide key={item._id} className="ml-4 w-fit">
						<ProductCard
							product={item}
							markLabel={markLabel}
							enableOptions={supportHover}
						/>
					</SwiperSlide>
				))}
		</Swiper>
	)
}

export default CustomSlider
