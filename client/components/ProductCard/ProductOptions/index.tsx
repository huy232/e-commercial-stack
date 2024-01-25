import { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } from "@/assets/icons"
import { path } from "@/utils"
import Link from "next/link"
import { FC, ReactNode } from "react"

interface ProductOptionsProps {
	productSlug: string
}

const productHoverOptions = [
	{ id: 1, icon: <AiFillEye /> },
	{ id: 2, icon: <AiOutlineMenu /> },
	{ id: 3, icon: <BsFillSuitHeartFill /> },
]

const ProductOptions: FC<ProductOptionsProps> = ({ productSlug }) => {
	return productHoverOptions.map((option, index) => {
		return (
			<Link href={`${path.PRODUCTS}/${productSlug}`} key={option.id}>
				<div className="w-10 h-10 bg-white rounded-full border-solid border-gray-500 border-[1px] shadow-md flex items-center justify-center hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800 duration-200 ease-linear">
					{option.icon}
				</div>
			</Link>
		)
	})
}

export default ProductOptions
