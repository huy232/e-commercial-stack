"use client"
import { FC, useState } from "react"
import { CategoryType } from "@/types/category"
import Link from "next/link"
import clsx from "clsx"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components"

interface SidebarProps {
	categories: CategoryType[]
}

const Sidebar: FC<SidebarProps> = ({ categories }) => {
	const [isOpen, setIsOpen] = useState(false)

	const sidebarClass = clsx(
		"max-lg:bg-[#121212] text-white hover:text-main hover:bg-white/20 opacity-80 duration-200 ease-linear text-sm px-2 mx-1 py-1 lg:py-2 rounded"
	)

	if (!categories) return <div>No categories available</div>

	return (
		<div className="lg:bg-[#282A3E] mx-1 p-1 rounded-md w-full flex-1">
			{/* Title bar */}
			<div className="flex items-center justify-between lg:block">
				<motion.h2
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="font-bebasNeue font-bold text-3xl mx-1 uppercase px-1 mb-2 text-black lg:text-[#EDF2F4] text-center lg:text-left relative rounded bg-gradient-to-r from-[#5f5f5f29] to-[#8a8a8a20] overflow-hidden"
				>
					Categories
					<span className="absolute bottom-0 left-0 w-full h-1 bg-main scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 rounded"></span>
				</motion.h2>

				{/* Mobile toggle */}
				<Button
					className="lg:hidden px-2 text-sm text-black bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
					onClick={() => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					aria-controls="category-list"
					aria-label={isOpen ? "Hide categories" : "Show categories"}
					role="button"
					tabIndex={0}
					data-testid="toggle-category-button"
					id="toggle-category-button"
				>
					{isOpen ? "Hide" : "Show"}{" "}
					{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</Button>
			</div>

			{/* Desktop view */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="hidden lg:flex lg:flex-col lg:overflow-y-auto lg:h-[420px] gap-1 p-1"
			>
				{categories.map((category) => (
					<Link
						key={category._id}
						href={`/products?category=${category.slug}`}
						className={clsx(
							"relative group flex items-center px-4 py-2 rounded-lg text-gray-300 font-medium transition-colors duration-300 cursor-pointer overflow-hidden",
							"hover:text-white hover:bg-white/10"
						)}
					>
						<span className="absolute left-0 top-0 h-full w-1 bg-main rounded-l-lg scale-y-0 origin-top transition-transform duration-300 group-hover:scale-y-100"></span>
						<span className="relative z-10">{category.title}</span>
						<motion.div
							className="absolute inset-0 bg-white/5 rounded-lg pointer-events-none"
							initial={{ opacity: 0 }}
							whileHover={{ opacity: 1 }}
							transition={{ duration: 0.3 }}
						/>
					</Link>
				))}
			</motion.div>

			{/* Mobile dropdown */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="lg:hidden flex flex-col gap-1 mt-2 bg-[#121212] rounded-md shadow-md p-2"
					>
						{categories.map((category) => (
							<Link
								key={category._id}
								href={`/products?category=${category.slug}`}
								className={sidebarClass}
								onClick={() => setIsOpen(false)}
							>
								{category.title}
							</Link>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default Sidebar
