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
		loading && "loading"
	)

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{ type: "spring", stiffness: 400, damping: 15 }}
			className={buttonClass}
			disabled={disabled || loading}
			{...rest}
		>
			{loading ? (
				<div className="flex items-center justify-center">
					<div className="animate-spin mr-2 w-4 h-4 border-t-2 border-blue-500 border-r-2 rounded-full"></div>
					Loading...
				</div>
			) : (
				children
			)}
		</motion.button>
	)
}

export default Button
