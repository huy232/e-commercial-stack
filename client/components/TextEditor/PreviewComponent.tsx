"use client"
import React from "react"
import { Button, CustomImage } from "@/components"

interface PreviewProps {
	content: string
	localImages: string[]
	onRemoveImage: (src: string) => void
}

const PreviewComponent: React.FC<PreviewProps> = ({
	content,
	localImages,
	onRemoveImage,
}) => {
	return (
		<div className="rounded mt-4">
			<h2 className="font-bold">Preview</h2>
			{content && (
				<div
					className="prose prose-lg bg-gray-200 rounded-md p-2 resize-y overflow-auto [&_img]:max-h-64 [&_img]:h-auto [&_img]:mx-auto"
					dangerouslySetInnerHTML={{ __html: content }}
					style={{ minHeight: "120px", maxHeight: "500px" }}
				/>
			)}

			{/* ✅ Only show images if they exist */}
			{localImages?.length > 0 && (
				<div className="mt-2">
					<h3 className="font-semibold">Selected Images</h3>
					<div className="flex flex-wrap gap-2 overflow-y-scroll max-h-[320px]">
						{localImages.map((src, index) => (
							<div key={index} className="relative group w-auto h-[120px]">
								<CustomImage
									src={src}
									alt="Preview"
									className="w-full h-full object-cover rounded border border-gray-300"
									fill
								/>
								<Button
									onClick={() => onRemoveImage(src)}
									className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
									aria-label="Remove image"
									role="button"
									tabIndex={0}
									data-testid={`remove-image-${index}-button`}
									id={`remove-image-${index}-button`}
								>
									✖
								</Button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default React.memo(PreviewComponent)
