import { useState, useEffect, useCallback, MouseEvent } from "react"

const useDropdown = (initialState = false) => {
	const [isOpen, setIsOpen] = useState(initialState)

	const openDropdown = useCallback(() => {
		setIsOpen(true)
	}, [])

	const closeDropdown = useCallback(() => {
		setIsOpen(false)
	}, [])

	const toggleDropdown = useCallback(() => {
		setIsOpen((prevIsOpen) => !prevIsOpen)
	}, [])

	const handleOutsideClick = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (
				isOpen &&
				event.target instanceof Element &&
				event.target.closest(".user-dropdown") === null
			) {
				closeDropdown()
			}
		},
		[isOpen, closeDropdown]
	)

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick as any)

		return () => {
			document.removeEventListener("click", handleOutsideClick as any)
		}
	}, [handleOutsideClick])

	return { isOpen, openDropdown, closeDropdown, toggleDropdown }
}

export default useDropdown
