"use client"
import Slider from "react-slick"
import { ProductCard } from "@/components"
import { ProductType } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import clsx from "clsx"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

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
	slideToShow,
	headingTitle,
	headingClassName,
	headingTabClassName,
	supportHover = false,
	supportDetail,
	markLabel,
}) => {
	const slickSettings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: slideToShow || 3,
		slidesToScroll: 1,
	}

	return (
		<div className="w-full">
			<Slider {...slickSettings} className="mt-4">
				{products &&
					products.map((item: ProductType) => (
						<ProductCard
							key={item._id}
							product={item}
							markLabel={markLabel}
							enableOptions={supportHover}
						/>
					))}
			</Slider>
		</div>
	)
}

export default CustomSlider
