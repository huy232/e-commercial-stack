"use client"
import { FC } from "react"
import { CustomImage, ImageUpload, Button } from "@/components"
import { MdDelete } from "@/assets/icons"
import clsx from "clsx"

interface ImagePreviewProps {
	images: File | File[]
	onDelete: (index: number) => void
}

const ImagePreview: FC<ImagePreviewProps> = ({ images, onDelete }) => {
	const handleDeleteImage = (index: number) => {
		onDelete(index)
	}

	const imageClass = clsx(
		`hidden absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-1 group-hover:block hover-effect`
	)

	return (
		<>
			{Array.isArray(images) ? (
				images.map((image, index) => (
					<div key={index} className="relative inline-block group">
						<CustomImage
							src={URL.createObjectURL(image)}
							alt={`Product Image ${index + 1}`}
							width={160}
							height={160}
						/>
						<button
							className={imageClass}
							onClick={() => handleDeleteImage(index)}
						>
							<MdDelete size={20} color="#FF0000" />
						</button>
					</div>
				))
			) : (
				<div className="relative inline-block group">
					<CustomImage
						src={URL.createObjectURL(images)}
						alt="Thumbnail"
						width={160}
						height={160}
					/>
					<button className={imageClass} onClick={() => onDelete(0)}>
						<MdDelete size={20} color="#FF0000" />
					</button>
				</div>
			)}
		</>
	)
}

export default ImagePreview
