"use client"
import { FC, ReactNode, useEffect, useRef } from "react"
import clsx from "clsx"

interface ModalProps {
	isOpen: boolean
	children: ReactNode
	onClose?: () => void
}

const Modal: FC<ModalProps> = ({ isOpen, children, onClose }) => {
	const modalRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node) &&
				onClose
			) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside)
		} else {
			document.removeEventListener("mousedown", handleClickOutside)
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isOpen, onClose])
	const modalClass = clsx(
		"fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50",
		{
			hidden: !isOpen,
		}
	)

	return (
		<div className={modalClass}>
			<div className="bg-white p-4" ref={modalRef}>
				{children}
			</div>
		</div>
	)
}

export default Modal
