import {
	AiOutlineDashboard,
	LuMenuSquare,
	MdGroups,
	TbBrandProducthunt,
} from "@/assets/icons"
import { adminDashboardStatus } from "@/types/adminDashboard"
import { path } from "@/utils"

export const adminSidebarOptions = [
	{
		id: 1,
		type: adminDashboardStatus.SINGLE,
		text: "Dashboard",
		path: `${path.ADMIN}/${path.DASHBOARD}`,
		icon: <AiOutlineDashboard />,
	},
	{
		id: 2,
		type: adminDashboardStatus.SINGLE,
		text: "Manage users",
		path: `${path.ADMIN}/${path.MANAGE_USER}`,
		icon: <MdGroups />,
	},
	{
		id: 3,
		type: adminDashboardStatus.PARENT,
		text: "Manage products",
		path: null,
		icon: <TbBrandProducthunt />,
		subMenu: [
			{
				id: 31,
				text: "Create product",
				path: `${path.ADMIN}/${path.CREATE_PRODUCTS}`,
			},
			{
				id: 32,
				text: "Manage product",
				path: `${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
			},
		],
	},
	{
		id: 4,
		type: adminDashboardStatus.SINGLE,
		text: "Orders",
		path: `${path.ADMIN}/${path.MANAGE_ORDERS}`,
		icon: <LuMenuSquare />,
	},
]
