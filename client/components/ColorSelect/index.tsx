"use client"
import { colorSelection } from "@/constant"

interface ColorSelectProps {
	selectedColors: string[]
	onColorsChange: (colors: string[]) => void
	disabled?: boolean
}

const ColorSelect: React.FC<ColorSelectProps> = ({
	selectedColors,
	onColorsChange,
	disabled,
}) => {
	const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = event.target
		if (checked) {
			onColorsChange([...selectedColors, value])
		} else {
			onColorsChange(selectedColors.filter((color) => color !== value))
		}
	}

	return (
		<div>
			<h3>Available Colors</h3>
			<div className="grid grid-cols-3 gap-2">
				{colorSelection.map((color) => (
					<label key={color} className="inline-flex items-center">
						<input
							type="checkbox"
							value={color}
							onChange={handleColorChange}
							checked={selectedColors.includes(color.toUpperCase())}
							className="mr-2"
							disabled={disabled}
						/>
						{color}
					</label>
				))}
			</div>
		</div>
	)
}

export default ColorSelect
