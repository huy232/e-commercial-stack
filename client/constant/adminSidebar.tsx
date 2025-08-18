import {
	AiOutlineDashboard,
	LuMenuSquare,
	MdGroups,
	TbBrandProducthunt,
} from "@/assets/icons"
import { adminDashboardStatus } from "@/types/adminDashboard"
import { generateAdminSidebar, path, RawSidebarOption } from "@/utils"

const rawSidebarOptions: RawSidebarOption[] = [
	{
		type: "SINGLE",
		text: "Dashboard",
		path: `${path.ADMIN}`,
		icon: <AiOutlineDashboard />,
	},
	{
		type: "SINGLE",
		text: "Manage users",
		path: `${path.ADMIN}/${path.MANAGE_USER}`,
		icon: <MdGroups />,
	},
	{
		type: "PARENT",
		text: "Manage products",
		path: null,
		icon: <TbBrandProducthunt />,
		subMenu: [
			{
				text: "Create product",
				path: `${path.ADMIN}/${path.CREATE_PRODUCTS}`,
			},
			{
				text: "Manage product",
				path: `${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
			},
		],
	},
	{
		type: "PARENT",
		text: "Manage blogs",
		path: null,
		icon: <TbBrandProducthunt />,
		subMenu: [
			{
				text: "Create blog",
				path: `${path.ADMIN}/${path.CREATE_BLOG}`,
			},
			{
				text: "Manage blogs",
				path: `${path.ADMIN}/${path.MANAGE_BLOGS}`,
			},
			{
				text: "Manage blog categories",
				path: `${path.ADMIN}/${path.MANAGE_BLOG_CATEGORIES}`,
			},
		],
	},
	{
		type: "SINGLE",
		text: "Manage brands",
		path: `${path.ADMIN}/${path.MANAGE_BRANDS}`,
		icon: <LuMenuSquare />,
	},
	{
		type: "SINGLE",
		text: "Manage categories",
		path: `${path.ADMIN}/${path.MANAGE_CATEGORIES}`,
		icon: <LuMenuSquare />,
	},
	{
		type: "SINGLE",
		text: "Manage chat rooms",
		path: `${path.ADMIN}/${path.MANAGE_CHAT_ROOMS}`,
		icon: <LuMenuSquare />,
	},
	{
		type: "SINGLE",
		text: "Orders",
		path: `${path.ADMIN}/${path.MANAGE_ORDERS}`,
		icon: <LuMenuSquare />,
	},
]

export const adminSidebarOptions = generateAdminSidebar(rawSidebarOptions)
