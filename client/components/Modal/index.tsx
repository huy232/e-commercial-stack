"use client"
import { FC, ReactNode, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import clsx from "clsx"
import { motion, AnimatePresence } from "framer-motion"
import { useClickOutside } from "@/hooks"
import Button from "../Button"
import { IoIosCloseCircle } from "@/assets/icons"

interface ModalProps {
	isOpen: boolean
	children: ReactNode
	onClose?: () => void
	specificHeight?: string
}

const Modal: FC<ModalProps> = ({
	isOpen,
	children,
	onClose,
	specificHeight,
}) => {
	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = ""
		}
		return () => {
			document.body.style.overflow = ""
		}
	}, [isOpen])

	useClickOutside(modalRef, () => {
		if (onClose) onClose()
	})

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Overlay */}
					<motion.div
						key="overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-black bg-opacity-50 z-40"
					/>

					{/* Modal container */}
					<motion.div
						key="modal"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 flex items-center justify-center z-50 w-full h-full"
					>
						<div
							ref={modalRef}
							className={clsx(
								"relative max-h-[90vh] w-[95%] max-w-5xl rounded-xl bg-white shadow-xl p-4 overflow-y-auto",
								specificHeight
							)}
						>
							<Button
								className="absolute top-2 right-2 hover:opacity-80 duration-200"
								onClick={onClose}
								aria-label="Close modal"
								role="button"
								tabIndex={0}
								data-testid="close-modal-button"
								id="close-modal-button"
							>
								<IoIosCloseCircle
									size={28}
									className="text-gray-500 hover:text-gray-700"
								/>
							</Button>
							{children}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>,
		document.body
	)
}

export default Modal
