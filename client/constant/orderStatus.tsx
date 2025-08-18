import {
	AiOutlineLoading3Quarters,
	FaShippingFast,
	FaUndoAlt,
	MdCancel,
	MdCheckCircle,
} from "@/assets/icons"

export const statusConfig = {
	cancelled: { icon: <MdCancel />, color: "text-red-500" },
	processing: {
		icon: <AiOutlineLoading3Quarters className="animate-spin" />,
		color: "text-yellow-500",
	},
	success: { icon: <MdCheckCircle />, color: "text-green-500" },
	refund: { icon: <FaUndoAlt />, color: "text-blue-500" },
	delivering: { icon: <FaShippingFast />, color: "text-purple-500" },
}
