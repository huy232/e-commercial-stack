"use client"
import { FC } from "react"
import parse from "html-react-parser"
import { CustomImage } from ".."
import { DefaultAvatar } from "@/assets/images"
import moment from "moment"
import { renderStarFromNumber } from "@/utils"

interface ReviewComment {
	reviews: {
		postedBy: {
			avatar?: string
			firstName?: string
		}
		star: number
		comment: string
		updatedAt: string
	}[]
}

const ReviewComment: FC<ReviewComment> = ({ reviews }) => {
	return (
		<div>
			{reviews ? (
				reviews.map((review, i) => (
					<div key={i} className="flex">
						<div className="p-4 flex-none">
							<CustomImage
								className="rounded full"
								height={30}
								width={30}
								src={review.postedBy.avatar || DefaultAvatar}
								alt="User avatar"
							/>
						</div>
						<div className="flex flex-col flex-auto">
							<div className="flex items-center gap-2">
								<span className="text-sm bg-black/20 rounded px-1 py-0.5">
									{review.postedBy.firstName || "Anonymous user"}
								</span>
								<span className="text-xs">
									{moment(review.updatedAt).fromNow()}
								</span>
							</div>
							<div className="flex flex-col">
								<span className="flex gap-1 text-xs mt-1">
									{renderStarFromNumber(review.star)}
								</span>
							</div>
							<div className="rounded mt-1">{parse(review.comment)}</div>
						</div>
					</div>
				))
			) : (
				<div>There is currently no review for this product</div>
			)}
		</div>
	)
}
export default ReviewComment
