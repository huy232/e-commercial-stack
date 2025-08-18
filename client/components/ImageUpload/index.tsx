"use client"
import clsx from "clsx"
import React, { useCallback } from "react"
import { FileRejection, useDropzone } from "react-dropzone"

interface ImageUploadProps {
	multiple?: boolean
	onUpload: (files: File[]) => void
	disabled?: boolean
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	multiple = false,
	onUpload,
	disabled,
}) => {
	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
			onUpload(acceptedFiles)
		},
		[onUpload]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple,
	})

	const imageUploadClass = clsx(
		`border border-gray-300 p-4 text-center cursor-pointer h-fit w-fit mt-2`,
		isDragActive && "bg-gray-100"
	)

	return (
		<div {...getRootProps()} className={imageUploadClass}>
			<input {...getInputProps()} disabled={disabled} />
			<p className="text-base font-medium">
				<span>Drag and drop your</span>
				<span className="italic text-gray-500 mx-1">
					{multiple ? "image(s)" : "image"}
				</span>
				<span>here</span>
			</p>
			<p className="italic text-xs uppercase font-semibold">or</p>
			<label
				htmlFor="file-upload"
				className="font-medium text-base cursor-pointer"
			>
				Browse
			</label>
		</div>
	)
}

export default ImageUpload
