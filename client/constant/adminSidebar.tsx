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
		path: `${path.ADMIN}`,
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
	// {
	// 	id: 4,
	// 	type: adminDashboardStatus.PARENT,
	// 	text: "Manage brands",
	// 	path: null,
	// 	icon: <TbBrandProducthunt />,
	// 	subMenu: [
	// 		{
	// 			id: 41,
	// 			text: "Create brand",
	// 			path: `${path.ADMIN}/${path.CREATE_BRAND}`,
	// 		},
	// 		{
	// 			id: 42,
	// 			text: "Manage brand",
	// 			path: `${path.ADMIN}/${path.MANAGE_BRANDS}`,
	// 		},
	// 	],
	// },
	// {
	// 	id: 5,
	// 	type: adminDashboardStatus.PARENT,
	// 	text: "Manage categories",
	// 	path: null,
	// 	icon: <TbBrandProducthunt />,
	// 	subMenu: [
	// 		{
	// 			id: 51,
	// 			text: "Create category",
	// 			path: `${path.ADMIN}/${path.CREATE_CATEGORY}`,
	// 		},
	// 		{
	// 			id: 52,
	// 			text: "Manage categories",
	// 			path: `${path.ADMIN}/${path.MANAGE_CATEGORIES}`,
	// 		},
	// 	],
	// },
	{
		id: 5,
		type: adminDashboardStatus.SINGLE,
		text: "Manage brands",
		path: `${path.ADMIN}/${path.MANAGE_BRANDS}`,
		icon: <LuMenuSquare />,
	},
	{
		id: 6,
		type: adminDashboardStatus.SINGLE,
		text: "Manage categories",
		path: `${path.ADMIN}/${path.MANAGE_CATEGORIES}`,
		icon: <LuMenuSquare />,
	},
	{
		id: 7,
		type: adminDashboardStatus.SINGLE,
		text: "Orders",
		path: `${path.ADMIN}/${path.MANAGE_ORDERS}`,
		icon: <LuMenuSquare />,
	},
]
