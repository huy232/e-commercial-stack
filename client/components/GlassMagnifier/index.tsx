"use client"
import { useState, useRef, MouseEvent, useEffect } from "react"
import Image from "next/image"

interface GlassMagnifierProps {
	imageSrc: string
	imageAlt?: string
	zoom?: number
	lensSize?: number
}

const GlassMagnifier: React.FC<GlassMagnifierProps> = ({
	imageSrc,
	imageAlt = "Product image",
	zoom = 2,
	lensSize = 150,
}) => {
	const [isHovering, setIsHovering] = useState(false)
	const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
	const [imgSize, setImgSize] = useState({ width: 0, height: 0 })
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (containerRef.current) {
			const { width, height } = containerRef.current.getBoundingClientRect()
			setImgSize({ width, height })
		}
	}, [])

	const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return
		const { left, top, width, height } =
			containerRef.current.getBoundingClientRect()
		const x = e.clientX - left
		const y = e.clientY - top

		setLensPos({
			x: Math.max(lensSize / 2, Math.min(x, width - lensSize / 2)),
			y: Math.max(lensSize / 2, Math.min(y, height - lensSize / 2)),
		})
	}

	return (
		<div
			ref={containerRef}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
			onMouseMove={handleMouseMove}
			className="relative w-full h-full overflow-hidden rounded-lg"
		>
			<Image
				src={imageSrc}
				alt={imageAlt}
				fill
				className="object-contain"
				sizes="100vw"
			/>

			{isHovering && (
				<div
					className="absolute pointer-events-none rounded-full border-2 border-gray-400 shadow-lg"
					style={{
						width: lensSize,
						height: lensSize,
						top: lensPos.y - lensSize / 2,
						left: lensPos.x - lensSize / 2,
						backgroundImage: `url(${imageSrc})`,
						backgroundRepeat: "no-repeat",
						backgroundSize: `${imgSize.width * zoom}px ${
							imgSize.height * zoom
						}px`,
						backgroundPosition: `${-lensPos.x * zoom + lensSize / 2}px ${
							-lensPos.y * zoom + lensSize / 2
						}px`,
					}}
				/>
			)}
		</div>
	)
}

export default GlassMagnifier
