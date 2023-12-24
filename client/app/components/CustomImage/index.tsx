"use client"

import { FC, useState } from "react"
import Image, { StaticImageData } from "next/image"
import clsx from "clsx"

interface CustomImageProps {
	src: string | StaticImageData
	alt: string
	className?: string
}

const CustomImage: FC<CustomImageProps> = ({ src, alt, className }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	const handleImageLoad = () => {
		setIsLoaded(true)
	}

	clsx()
	const imageClass = clsx(
		"transition-opacity duration-200 ease-in-out static object-contain",
		{
			"opacity-0": !isLoaded,
			"opacity-100": isLoaded,
		},
		className
	)

	return (
		<Image
			src={src}
			alt={alt}
			className={imageClass}
			loading="lazy"
			onLoad={handleImageLoad}
			fill
		/>
	)
}

export default CustomImage
