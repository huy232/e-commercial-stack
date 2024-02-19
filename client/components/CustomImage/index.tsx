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
	fill?: boolean
}

const CustomImage: FC<CustomImageProps> = ({
	src,
	alt,
	className,
	onClick,
	width,
	height,
	fill,
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
			src={src}
			alt={alt}
			className={imageClass}
			loading="lazy"
			onLoad={handleImageLoad}
			onClick={onClick}
			{...(fill ? {} : { width, height })}
			{...(fill ? { fill: true } : {})}
			{...rest}
		/>
	)
}

export default CustomImage
