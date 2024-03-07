"use client"
import React, { useCallback } from "react"
import { DropEvent, FileRejection, useDropzone } from "react-dropzone"

interface ImageUploadProps {
	multiple?: boolean
	onUpload: (files: FileList | File) => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	multiple = false,
	onUpload,
}) => {
	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
			const filesArray = acceptedFiles.concat(
				fileRejections.map((fileRejection) => fileRejection.file)
			)
			filesArray.forEach((file) => {
				onUpload(file)
			})
		},
		[onUpload]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple,
	})

	return (
		<div
			{...getRootProps()}
			className={`border border-gray-300 p-4 text-center ${
				isDragActive ? "bg-gray-100" : ""
			}`}
		>
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
