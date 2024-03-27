import { FaHouseUser, FaShoppingCart, FaClipboardList } from "@/assets/icons"
import { path } from "@/utils"

export const profileSidebarOptions = [
	{
		id: 1,
		text: "General",
		path: `${path.PROFILE}`,
		icon: <FaHouseUser />,
	},
	{
		id: 2,
		text: "Orders",
		path: `${path.PROFILE}/${path.ORDERS}`,
		icon: <FaShoppingCart />,
	},
	{
		id: 3,
		text: "Wishlist",
		path: `${path.PROFILE}/${path.WISHLIST}`,
		icon: <FaClipboardList />,
	},
]
