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
		const src = typeof image === "string" ? image : URL.createObjectURL(image)
		return (
			<div
				key={index}
				className="relative group w-[160px] h-[160px] shrink-0 mx-2 border border-gray-300 rounded overflow-hidden"
			>
				<CustomImage
					src={src}
					alt={`Product Image ${index + 1}`}
					fill
					className="object-cover"
				/>
				{!disabled && (
					<Button
						type="button"
						className={imageClass}
						onClick={() => handleDeleteImage(index)}
						aria-label={`Delete image ${index + 1}`}
						role="button"
						tabIndex={0}
						data-testid={`delete-image-button-${index + 1}`}
						id={`delete-image-button-${index + 1}`}
					>
						<MdDelete size={20} color="#FF0000" />
					</Button>
				)}
			</div>
		)
	}

	return (
		<div className="flex flex-wrap">
			{Array.isArray(images) &&
				images.map((image, index) => renderImage(image, index))}
		</div>
	)
}

export default ImagePreview
