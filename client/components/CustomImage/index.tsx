"use client"
import { FC, useState, MouseEvent } from "react"
import Image, { StaticImageData } from "next/image"
import clsx from "clsx"

interface CustomImageProps {
	src: string | StaticImageData
	alt: string
	className?: string
	onClick?: (event: MouseEvent<HTMLImageElement>) => void
	width?: number
	height?: number
}

const CustomImage: FC<CustomImageProps> = ({
	src,
	alt,
	className,
	onClick,
	width,
	height,
	...rest
}) => {
	const [isLoaded, setIsLoaded] = useState(false)

	const handleImageLoad = () => {
		setIsLoaded(true)
	}
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
			width={width}
			height={height}
			src={src}
			alt={alt}
			className={imageClass}
			loading="lazy"
			onLoad={handleImageLoad}
			// fill
			onClick={onClick}
			{...rest}
		/>
	)
}

export default CustomImage
