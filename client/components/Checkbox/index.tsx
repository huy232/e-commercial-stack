import clsx from "clsx"
import { FC } from "react"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	size?: number
}

const Checkbox: FC<CheckboxProps> = ({
	label,
	name,
	checked,
	onChange,
	size,
	...rest
}) => {
	return (
		<div className="inline-flex items-center">
			<label
				className="flex items-center relative disabled:cursor-not-allowed"
				htmlFor={name}
			>
				<input
					type="checkbox"
					checked={checked}
					name={name}
					onChange={onChange}
					className={clsx(
						"peer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800 disabled:cursor-not-allowed cursor-pointer",
						size ? `h-${size} w-${size}` : "h-3 w-3"
					)}
					id={name}
					{...rest}
				/>

				<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 peer-disabled:cursor-not-allowed cursor-pointer">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={clsx(size ? `h-${size - 1} w-${size - 1}` : "h-2 w-2")}
						viewBox="0 0 20 20"
						fill="currentColor"
						stroke="currentColor"
						strokeWidth="1"
					>
						<path
							fillRule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
						></path>
					</svg>
				</span>
			</label>
			{label && (
				<label
					className="ml-1 text-slate-600 text-base disabled:cursor-not-allowed cursor-pointer mb-[2px]"
					htmlFor={name}
				>
					{label}
				</label>
			)}
		</div>
	)
}

export default Checkbox
