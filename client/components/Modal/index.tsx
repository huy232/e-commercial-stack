"use client"
import { FC, ReactNode, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import clsx from "clsx"
import { useClickOutside } from "@/hooks"

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
							<div className="bg-white p-4" ref={modalRef}>
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
