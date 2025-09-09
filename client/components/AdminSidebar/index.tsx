"use client"
import { useRef, useState } from "react"
import { adminSidebarOptions } from "@/constant"
import { adminDashboardStatus } from "@/types/adminDashboard"
import Link from "next/link"
import clsx from "clsx"
import { AdminSidebarOption } from "@/types"
import {
	FaAngleDoubleLeft,
	FaArrowDownShortWide,
	FaHome,
	IoIosCloseCircle,
	IoMenu,
} from "@/assets/icons"
import { usePathname } from "next/navigation"
import { Button, Logo } from "@/components"
import { useClickOutside } from "@/hooks"

const AdminSidebar = () => {
	const pathname = usePathname()
	const [activeParentMenus, setActiveParentMenus] = useState<number[]>([])
	const [activeSubmenus, setActiveSubmenus] = useState<number[]>([])
	const [toggleMenu, setToggleMenu] = useState<boolean>(false)
	const sidebarRef = useRef<HTMLDivElement>(null)

	const handleShowTab = (option: AdminSidebarOption) => {
		if (option.type === adminDashboardStatus.PARENT) {
			if (activeParentMenus.includes(option.id)) {
				setActiveParentMenus((prev) => prev.filter((id) => id !== option.id))
				setActiveSubmenus((prev) =>
					prev.filter((id) => option.subMenu?.some((sub) => sub.id === id))
				)
			} else {
				setActiveParentMenus((prev) => [...prev, option.id])
				setActiveSubmenus((prev) => [
					...prev,
					...(option.subMenu ? option.subMenu.map((sub) => sub.id) : []),
				])
			}
		} else if (option.path && option.path === pathname) {
			setActiveParentMenus([])
			setActiveSubmenus([])
		}
	}
	const computeClassName = (
		option: AdminSidebarOption,
		additionClassName?: string
	) =>
		clsx(
			"px-4 py-2 flex items-center gap-2 text-gray-200 text-sm rounded duration-300 ease-linear",
			{
				"bg-black/80":
					(option.type === adminDashboardStatus.SINGLE &&
						option.path === pathname) ||
					activeParentMenus.includes(option.id) ||
					activeSubmenus.includes(option.id),
				"hover:bg-black/60":
					option.type === adminDashboardStatus.SINGLE &&
					!activeParentMenus.includes(option.id) &&
					!activeSubmenus.includes(option.id),
			},
			additionClassName
		)

	useClickOutside(sidebarRef, () => {
		setToggleMenu(false)
	})

	return (
		<>
			<Button
				onClick={() => {
					setToggleMenu(!toggleMenu)
				}}
				className="absolute ml-1 mt-1 bg-[#808080] rounded shadow-xl p-1 inline-block w-fit h-fit hover:opacity-80 hover:brightness-105 hover:bg-rose-500 hover:scale-110 duration-300 ease-in-out"
				type="button"
				aria-label="Toggle Menu"
				aria-expanded={toggleMenu}
				aria-controls="admin-sidebar"
				id="admin-sidebar"
			>
				<IoMenu className="text-white" size={24} />
			</Button>
			<div
				className={clsx(
					"bg-rose-500 h-screen top-0 fixed transition-all duration-300 ease-in-out py-4 z-10",
					toggleMenu ? "opacity-100 w-[320px]" : "opacity-0 -translate-x-full"
				)}
				ref={sidebarRef}
			>
				<div className="mx-4 flex justify-between items-center">
					<Link
						href={"/"}
						className="hover:bg-black/60 px-2 py-1 inline-flex gap-1 items-center rounded group text-white"
					>
						<FaHome size={26} />
						<span className="opacity-0 -translate-y-full group-hover:translate-y-0 group-hover:opacity-100 duration-300 ease-in-out transition-all">
							Home
						</span>
					</Link>
					<Button
						className="relative z-50 text-white group w-[40px] h-[40px] flex items-center justify-center"
						onClick={() => setToggleMenu(false)}
						type="button"
						aria-label="Close Menu"
					>
						<FaAngleDoubleLeft
							className="absolute opacity-100 group-hover:opacity-0 transition-all duration-500 ease-in-out bg-black/50 rounded p-1 scale-100 group-hover:scale-0"
							size={36}
						/>
						<IoIosCloseCircle
							className="absolute opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out bg-black/50 rounded p-1 scale-0 group-hover:scale-125"
							size={36}
						/>
					</Button>
				</div>
				<div className="mt-4 overflow-y-auto h-full">
					{adminSidebarOptions.map((option) => (
						<div key={option.id}>
							{option.type === adminDashboardStatus.SINGLE && (
								<div className="py-1 mx-2 md:mx-4 lg:mx-8">
									<Link
										href={option.path || ""}
										className={computeClassName(option)}
										onClick={() => setToggleMenu(false)} // Close sidebar on click
									>
										<span>{option.icon}</span>
										<span>{option.text}</span>
									</Link>
								</div>
							)}
							{option.type === adminDashboardStatus.PARENT && (
								<div className="py-1 mx-2 md:mx-4 lg:mx-8">
									<Button
										className={`px-4 py-2 flex flex-col gap-2 text-gray-200 hover:bg-black/60 text-sm w-full rounded duration-300 ease-linear`}
										onClick={() => handleShowTab(option)}
										type="button"
										aria-expanded={activeParentMenus.includes(option.id)}
										aria-controls={`submenu-${option.id}`}
										aria-label={`Toggle ${option.text} submenu`}
										id={`submenu-${option.id}`}
									>
										<div className="flex items-center gap-2">
											<span>{option.icon}</span>
											<span>{option.text}</span>
											<FaArrowDownShortWide />
										</div>
									</Button>
									{activeParentMenus.includes(option.id) &&
										option.subMenu?.map((sub) => (
											<Link
												href={sub.path}
												key={sub.id}
												className={clsx(
													"pl-6 py-2 flex items-center gap-2 text-gray-200 text-sm rounded mx-4 mt-2",
													{
														"bg-black/80": sub.path === pathname,
														"hover:bg-black/60": sub.path !== pathname,
													}
												)}
												onClick={(e) => {
													// e.stopPropagation()
													setToggleMenu(false) // Close sidebar on click
												}}
											>
												<div>{sub.text}</div>
											</Link>
										))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default AdminSidebar
