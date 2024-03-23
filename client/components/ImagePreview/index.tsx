import { FC } from "react"
import { CustomImage, ImageUpload, Button } from "@/components"
import { MdDelete } from "@/assets/icons"
import clsx from "clsx"

interface ImagePreviewProps {
	images: File | File[] | string | string[] | Array<string | File>
	onDelete: (index: number) => void
	disabled?: boolean
}

const ImagePreview: FC<ImagePreviewProps> = ({
	images,
	onDelete,
	disabled,
}) => {
	const handleDeleteImage = (index: number) => {
		onDelete(index)
	}

	const imageClass = clsx(
		`hidden absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-1 group-hover:block hover-effect`
	)

	const renderImage = (image: string | File, index: number) => {
		return (
			<div
				key={index}
				className="relative inline-block group w-[160px] h-[160px]"
			>
				<CustomImage
					src={
						typeof image === "string"
							? image
							: URL.createObjectURL(image as File)
					}
					alt={`Product Image ${index + 1}`}
					fill
				/>
				<button
					className={imageClass}
					onClick={() => handleDeleteImage(index)}
					disabled={disabled}
				>
					<MdDelete size={20} color="#FF0000" />
				</button>
			</div>
		)
	}

	return (
		<>
			{Array.isArray(images)
				? images.map((image, index) => renderImage(image, index))
				: renderImage(images, 0)}
		</>
	)
}

export default ImagePreview
