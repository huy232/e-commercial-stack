import { useEffect, RefObject } from "react"

function useClickOutside(
	ref: RefObject<HTMLElement>,
	handler: (event: MouseEvent) => void
) {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler(event)
			}
		}

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handler(event as unknown as MouseEvent)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		document.addEventListener("keydown", handleEscapeKey)

		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
			document.removeEventListener("keydown", handleEscapeKey)
		}
	}, [ref, handler])
}

export default useClickOutside
