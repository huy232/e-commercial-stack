"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaChevronDown } from "react-icons/fa"
import clsx from "clsx"

interface AccordionProps {
	title: string
	children: React.ReactNode
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className="border rounded-lg overflow-hidden shadow-md transition-all"
		>
			{/* Button */}
			<button
				className={clsx(
					"w-full flex justify-between items-center p-3 transition-all",
					isOpen ? "bg-red-500 text-white shadow-lg" : "bg-gray-100 text-black"
				)}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="font-semibold text-left">{title}</span>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.3 }}
				>
					<FaChevronDown
						className={clsx(isOpen ? "text-white" : "text-gray-500")}
					/>
				</motion.div>
			</button>

			{/* Content */}
			<motion.div
				initial="collapsed"
				animate={isOpen ? "open" : "collapsed"}
				variants={{
					open: { height: "auto", opacity: 1 },
					collapsed: { height: 0, opacity: 0 },
				}}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				className="overflow-hidden"
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: isOpen ? 1 : 0 }}
					transition={{ duration: 0.3 }}
					className="p-3 bg-black/10"
				>
					{children}
				</motion.div>
			</motion.div>
		</motion.div>
	)
}

export default Accordion
