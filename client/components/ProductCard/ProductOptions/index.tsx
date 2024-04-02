"use client"
import { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } from "@/assets/icons"
import { Modal } from "@/components"
import { path } from "@/utils"
import clsx from "clsx"
import Link from "next/link"
import { FC, ReactNode, useState } from "react"

interface ProductOptionsProps {
	productSlug: string
}

const productHoverOptions = [
	{ id: 1, icon: <AiFillEye /> },
	{ id: 2, icon: <AiOutlineMenu /> },
	{ id: 3, icon: <BsFillSuitHeartFill /> },
]

const ProductOptions: FC<ProductOptionsProps> = ({ productSlug }) => {
	const [showModal, setShowModal] = useState(false)

	const optionClass = clsx(
		`w-10 h-10 bg-white rounded-full border-solid border-gray-500 border-[1px] shadow-md flex items-center justify-center hover:bg-gray-800 hover:text-white cursor-pointer hover:border-gray-800 duration-200 ease-linear`
	)
	const handleQuickView = () => {
		setShowModal(!showModal)
	}
	const handleCloseQuickView = () => {
		setShowModal(false)
	}
	const handleWishlist = () => {}

	return (
		<>
			{showModal && (
				<Modal isOpen={showModal} onClose={handleCloseQuickView}>
					Product info
				</Modal>
			)}
			{productHoverOptions.map((option, index) => {
				if (option.id === 1) {
					return (
						<div
							className={optionClass}
							onClick={handleQuickView}
							key={option.id}
						>
							{option.icon}
						</div>
					)
				}
				if (option.id === 2) {
					return (
						<Link href={`${path.PRODUCTS}/${productSlug}`} key={option.id}>
							<div className={optionClass}>{option.icon}</div>
						</Link>
					)
				}
				if (option.id === 3) {
					return (
						<div
							key={option.id}
							className={optionClass}
							onClick={handleWishlist}
						>
							{option.icon}
						</div>
					)
				}
			})}
		</>
	)
}

export default ProductOptions
