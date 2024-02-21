"use client"
import { memo, FC, useState } from "react"
import clsx from "clsx"
import { reviewRating } from "@/constant"
import { AiFillStar } from "@/assets/icons"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface ReviewOptionsProps {
	productName: string
}

const ReviewOption: FC<ReviewOptionsProps> = ({ productName }) => {
	const [value, setValue] = useState("")
	const headingClassName = clsx(
		`mb-[20px] text-sm font-bold border-l-2 border-main pl-2 uppercase`
	)
	return (
		<div
			className="flex flex-col gap-4 items-center justify-center p-4"
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className={headingClassName}>Digital World</h2>
			<h3>Review this product: {productName}</h3>
			{/* <textarea name="form-textarea w-full" id=""></textarea> */}
			<ReactQuill theme="snow" value={value} onChange={setValue} />;
			<div className="w-full flex flex-col gap-4">
				<p>How do you like this product</p>
				<div className="flex items-center justify-center gap-4">
					{reviewRating.map((review) => (
						<div
							key={review.id}
							className="w-[100px] flex items-center justify-center flex-col gap-2 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md p-4 h-[100px]"
						>
							<AiFillStar color="gray" />
							<span>{review.text}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
export default memo(ReviewOption)
