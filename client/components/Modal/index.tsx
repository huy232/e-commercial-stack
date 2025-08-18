"use client"
import { FC, ReactNode, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import clsx from "clsx"
import { useClickOutside } from "@/hooks"
import Button from "../Button"
import { IoIosCloseCircle } from "@/assets/icons"

interface ModalProps {
	isOpen: boolean
	children: ReactNode
	onClose?: () => void
}

const Modal: FC<ModalProps> = ({ isOpen, children, onClose }) => {
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

	const overlayClass = clsx("fixed inset-0 bg-black bg-opacity-50 z-40", {
		hidden: !isOpen,
	})

	const modalClass = clsx(
		"fixed inset-0 flex items-center justify-center z-50 w-full h-full",
		{
			hidden: !isOpen,
		}
	)

	return isOpen
		? createPortal(
				<>
					<div className={overlayClass}>
						<div className={modalClass}>
							<div
								className="max-h-full bg-white p-4 relative overflow-y-auto"
								ref={modalRef}
							>
								<Button
									className="absolute top-0 right-0 mr-2 mt-2 hover:opacity-80 duration-300 ease-linear z-10"
									onClick={onClose}
								>
									<IoIosCloseCircle size={24} />
								</Button>
								{children}
							</div>
						</div>
					</div>
				</>,
				document.body
		  )
		: null
}

export default Modal
