"use client"

import { FC, useState } from "react"
import Image, { StaticImageData } from "next/image"
import clsx from "clsx"

interface CustomImageProps {
	src: string | StaticImageData
	alt: string
	className?: string
}

export const CustomImage: FC<CustomImageProps> = ({ src, alt, className }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	const handleImageLoad = () => {
		setIsLoaded(true)
	}

	const imageClass = clsx(className)

	return (
		<div
			className={clsx("inset-0 transition-opacity duration-200 ease-in-out", {
				"opacity-0": !isLoaded,
				"opacity-100": isLoaded,
			})}
		>
			<Image
				src={src}
				alt={alt}
				className={imageClass}
				loading="lazy"
				onLoad={handleImageLoad}
				layout="fill"
			/>
		</div>
	)
}
