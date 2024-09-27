import { FC } from "react"

interface CheckboxProps {
	label: string
	name: string
	checked: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: FC<CheckboxProps> = ({ label, name, checked, onChange }) => {
	return (
		<div className="flex items-center">
			<input
				type="checkbox"
				id={name}
				name={name}
				checked={checked}
				onChange={onChange}
				className="mr-2"
			/>
			{label && <label htmlFor={name}>{label}</label>}
		</div>
	)
}

export default Checkbox
