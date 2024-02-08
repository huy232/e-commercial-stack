import { AiOutlineDown } from "@/assets/icons"
import { FC, memo } from "react"
interface FilterBarProps {
	name: string
	activeClick?: string | null
	onActiveClick: (name: string) => void
}

const FilterBar: FC<FilterBarProps> = ({
	name,
	activeClick,
	onActiveClick,
}) => {
	return (
		<div
			className="p-4 text-xs gap-6 relative border border-gray-800 flex items-center justify-center text-gray-500"
			onClick={() => onActiveClick(name)}
		>
			<span className="uppercase">{name}</span>
			<AiOutlineDown />
			{activeClick === name && (
				<div className="absolute-top top-full left-0 w-fit p-4 bg-rose-500">
					Content
				</div>
			)}
		</div>
	)
}
export default memo(FilterBar)
