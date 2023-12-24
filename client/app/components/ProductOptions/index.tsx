import { FC, ReactNode } from "react"

interface ProductOptionsProps {
	icon: ReactNode
}

const ProductOptions: FC<ProductOptionsProps> = ({ icon }) => {
	return (
		<div className="w-10 h-10 bg-white rounded-full border-solid border-gray-500 border-[1px] shadow-md flex items-center justify-center hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800 duration-200 ease-linear">
			{icon}
		</div>
	)
}

export default ProductOptions
