"use client"
import clsx from "clsx"
import React, { useCallback } from "react"
import { FileRejection, useDropzone } from "react-dropzone"

interface ImageUploadProps {
	multiple?: boolean
	onUpload: (files: File[]) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	multiple = false,
	onUpload,
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
		`border border-gray-300 p-4 text-center cursor-pointer h-fit`,
		isDragActive && "bg-gray-100"
	)

	return (
		<div {...getRootProps()} className={imageUploadClass}>
			<input {...getInputProps()} />
			<p>Drag and drop your {multiple ? "images" : "image"} here</p>
			<p>or</p>
			<label htmlFor="file-upload" className="cursor-pointer">
				Browse
			</label>
		</div>
	)
}

export default ImageUpload
