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
				<h2 className="font-bebasNeue font-bold text-2xl mx-1 uppercase h-[40px] mb-1 lg:border-b-2 lg:border-b-gray-200 text-black lg:text-[#EDF2F4] text-center lg:text-left bg-[#5f5f5f29] p-2 rounded">
					Categories
				</h2>

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
			<div className="hidden lg:flex lg:flex-col lg:overflow-y-scroll lg:h-[420px]">
				{categories.map((category) => (
					<Link
						key={category._id}
						href={`/products?category=${category.slug}`}
						className={sidebarClass}
					>
						{category.title}
					</Link>
				))}
			</div>

			{/* Mobile animated dropdown */}
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
