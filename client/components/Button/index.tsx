import clsx from "clsx"
import { ReactNode, ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
		`${baseClass}`,
		className,
		disabled && "disabled",
		loading && "loading"
	)

	return (
		<button className={buttonClass} disabled={disabled || loading} {...rest}>
			{loading ? (
				<div className="flex items-center">
					<div className="animate-spin mr-2 w-4 h-4 border-t-2 border-blue-500 border-r-2 rounded-full"></div>
					Loading...
				</div>
			) : (
				children
			)}
		</button>
	)
}

export default Button
