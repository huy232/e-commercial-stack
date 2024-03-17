import clsx from "clsx"
import { FC } from "react"
import { AiOutlineLoading3Quarters } from "@/assets/icons"

interface LoadingSpinnerProps {
	color?: string
	text?: string
	size?: number
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
	color = "red-500",
	text,
	size = 8,
}) => {
	const spinnerClass = clsx(
		`spinner-border animate-spin inline-block rounded-full`,
		`w-${size} h-${size}`
	)

	return (
		<div className="flex justify-center items-center overflow-hidden opacity-75 gap-1">
			<div className={spinnerClass} role="status">
				<span className="visually-hidden">
					<svg
						className="animate-spin -inline-block border-4 rounded-full"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				</span>
			</div>
			{text && <span>{text}</span>}
		</div>
	)
}

export default LoadingSpinner
