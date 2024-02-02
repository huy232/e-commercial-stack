import { FC, ReactElement, memo } from "react"
import { IconBaseProps } from "react-icons"

interface ProductExtraInfoProps {
	title: string
	description: string
	icon: ReactElement<IconBaseProps>
}

const ProductExtraInfo: FC<ProductExtraInfoProps> = ({
	title,
	description,
	icon,
}) => {
	return (
		<div className="flex items-center p-2 gap-4 mb-[10px] border">
			<span className="p-2 bg-gray-800 rounded-full flex items-center justify-center text-white">
				{icon}
			</span>
			<div className="flex flex-col text-sm text-gray-500">
				<span className="font-medium text-black">{title}</span>
				<span className="text-xs">{description}</span>
			</div>
		</div>
	)
}
export default memo(ProductExtraInfo)
