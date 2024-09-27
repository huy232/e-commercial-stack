import { toast, ToastContainer, ToastOptions } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const showToast = (
	message: string,
	type: "success" | "error" | "info" | "warn",
	options?: ToastOptions
) => {
	switch (type) {
		case "success":
			toast.success(message, options)
			break
		case "error":
			toast.error(message, options)
			break
		case "info":
			toast.info(message, options)
			break
		case "warn":
			toast.warn(message, options)
			break
		default:
			toast(message, options)
	}
}

const Toast = () => {
	return <ToastContainer />
}

export { showToast, Toast }
