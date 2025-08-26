"use client"
import { navigation } from "@/utils/"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { FC, useState } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Navbar: FC = () => {
	const currentPath = usePathname()
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className="border-y mb-2 w-full xl:w-main">
			{/* Desktop navbar */}
			<div className="hidden lg:flex items-center gap-4 h-[48px] py-2 font-semibold font-bebasNeue">
				{navigation.map((nav, index) => {
					const linkClasses = clsx(
						"p-1 my-1 text-xl hover:text-main duration-200 ease-in-out hover:bg-black/20 rounded",
						{
							"text-main": currentPath === nav.path,
							"text-black": currentPath !== nav.path,
						},
						nav.path === navigation[0].path && "hidden lg:block"
					)
					return (
						<Link key={index} href={nav.path} className={linkClasses}>
							{nav.value}
						</Link>
					)
				})}
			</div>

			{/* Mobile navbar */}
			<div
				className="lg:hidden flex items-center justify-between h-[48px] px-2 font-bebasNeue cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className="font-bold text-xl">Menu</div>
				<button>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
			</div>

			{/* Animated mobile dropdown */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="lg:hidden flex flex-col gap-2 px-2 py-3 bg-gray-100 font-semibold font-bebasNeue shadow-md"
					>
						{navigation.map((nav, index) => {
							const linkClasses = clsx(
								"p-1 text-lg hover:text-main duration-200 ease-in-out hover:bg-black/20 rounded",
								{
									"text-main": currentPath === nav.path,
									"text-black": currentPath !== nav.path,
								}
							)
							return (
								<Link
									key={index}
									href={nav.path}
									className={linkClasses}
									onClick={() => setIsOpen(false)} // close menu on click
								>
									{nav.value}
								</Link>
							)
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Navbar
