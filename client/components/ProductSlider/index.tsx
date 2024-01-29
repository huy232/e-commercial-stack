"use client"
import { FC } from "react"
import Slider from "react-slick"
import { CustomImage } from "@/components"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface ProductSliderProps {
	images: string[]
}

const ProductSlider: FC<ProductSliderProps> = ({ images }) => {
	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
	}
	return (
		<Slider className="flex gap-4" {...settings}>
			{images.map((image, index) => (
				<CustomImage
					className="w-[140px] h-[140px]"
					src={image}
					alt="Sub product"
					key={index}
				/>
			))}
		</Slider>
	)
}
export default ProductSlider
