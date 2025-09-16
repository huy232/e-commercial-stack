"use client"
import clsx from "clsx"
import { ReactNode } from "react"
import { motion, HTMLMotionProps } from "framer-motion"

interface ButtonProps extends HTMLMotionProps<"button"> {
	children: ReactNode
	loading?: boolean
}

const Button: React.FC<ButtonProps> = ({
	children,
	className,
	disabled,
	loading,
	...rest
}) => {
	const baseClass = "custom-button"
	const buttonClass = clsx(
		baseClass,
		className,
		disabled && "disabled",
		loading && "loading",
		disabled && !loading && "opacity-50 cursor-not-allowed pointer-events-none"
	)

	return (
		<motion.button
			className={buttonClass}
			disabled={disabled || loading}
			{...rest}
		>
			{loading ? (
				<div className="flex items-center justify-center">
					<div className="animate-spin md:mr-1 w-4 h-4 border-t-2 border-blue-500 border-r-2 rounded-full"></div>
					<span className="hidden md:inline-block text-sm">Loading</span>
				</div>
			) : (
				children
			)}
		</motion.button>
	)
}

export default Button
