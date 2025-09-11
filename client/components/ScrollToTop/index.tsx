"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > 300)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					initial={{ opacity: 0, scale: 0.5, y: 50 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.5, y: 50 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					onClick={scrollToTop}
					className="z-40 p-3 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
					aria-label="Scroll to top"
				>
					<ChevronUp className="w-5 h-5" />
				</motion.button>
			)}
		</AnimatePresence>
	)
}

export default ScrollToTop
