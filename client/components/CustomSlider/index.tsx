"use client"
import { ProductCard } from "@/components"
import { ProductType } from "@/types"
import { FC } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import "swiper/css" // Import Swiper styles
import "swiper/css/navigation"
import "swiper/css/pagination"

interface CustomSliderProps {
	products: ProductType[] | null
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
			spaceBetween={30}
			slidesPerView={slideToShow}
			loop={true}
			navigation={true} // Enable navigation buttons
			// pagination={{ clickable: true }} // Enable pagination
			className="mt-4"
		>
			{products &&
				products.map((item: ProductType) => (
					<SwiperSlide key={item._id}>
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
