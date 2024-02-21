"use client"
import { FC, useState } from "react"
import Slider from "react-slick"
import { CustomImage } from "@/components"
import { GlassMagnifier } from "react-image-magnifiers-v2"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface ProductSliderProps {
	images: string[]
}

const ProductSlider: FC<ProductSliderProps> = ({ images }) => {
	const [displayImage, setDisplayImage] = useState(images[0])
	const settings = {
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
	}

	const handleImage = (index: number) => {
		setDisplayImage(images[index])
	}

	return (
		<>
			<div className="h-[320px]">
				<GlassMagnifier
					imageSrc={displayImage}
					imageAlt="Display product image"
					className="glass-magnifier h-full"
				/>
			</div>
			<Slider className="flex gap-4" {...settings}>
				{images.map((image, index) => (
					<CustomImage
						fill
						className="w-[140px] h-[140px]"
						src={image}
						alt="Sub product"
						key={index}
						onClick={() => handleImage(index)}
					/>
				))}
			</Slider>
		</>
	)
}
export default ProductSlider
