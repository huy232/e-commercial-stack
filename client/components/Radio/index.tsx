import clsx from "clsx"
import { FC } from "react"

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	size?: number
	value: string
}

const Radio: FC<RadioProps> = ({
	label,
	name,
	value,
	checked,
	onChange,
	size,
	...rest
}) => {
	return (
		<div className="inline-flex items-center">
			<input
				type="radio"
				id={value} // Ensure unique id per radio
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
				className={clsx("peer hidden")}
				{...rest}
			/>
			<label
				htmlFor={value} // Associate label with radio input
				className={clsx(
					"flex items-center cursor-pointer text-slate-700 text-sm border border-slate-300 rounded-md p-2 transition duration-300 ease-in-out",
					checked
						? "bg-slate-800 text-white border-slate-800"
						: "hover:bg-slate-200"
				)}
			>
				{label}
			</label>
		</div>
	)
}

export default Radio
