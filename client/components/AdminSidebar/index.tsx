"use client"
import { Fragment, useState } from "react"
import { adminSidebarOptions } from "@/constant"
import { adminDashboardStatus } from "@/types/adminDashboard"
import Link from "next/link"
import clsx from "clsx"
import { AdminSidebarOption } from "@/types"
import { FaArrowDownShortWide } from "@/assets/icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Logo } from "@/components"

const AdminSidebar = () => {
	const pathname = usePathname()

	const [activeParentMenus, setActiveParentMenus] = useState<number[]>([])
	const [activeSubmenus, setActiveSubmenus] = useState<number[]>([])

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
			"px-4 py-2 flex items-center gap-2 text-gray-200 text-sm rounded",
			{
				"bg-gray-500":
					(option.type === adminDashboardStatus.SINGLE &&
						option.path === pathname) ||
					activeParentMenus.includes(option.id) ||
					activeSubmenus.includes(option.id),
				"hover:bg-gray-600":
					option.type === adminDashboardStatus.SINGLE &&
					!activeParentMenus.includes(option.id) &&
					!activeSubmenus.includes(option.id),
			},
			additionClassName
		)

	return (
		<div className="bg-zinc-800 h-screen py-4 rounded w-[320px]">
			<div className="flex flex-col w-fit">
				<Logo />
			</div>
			<span>Admin workspace</span>
			{adminSidebarOptions.map((option) => (
				<Fragment key={option.id}>
					{option.type === adminDashboardStatus.SINGLE && (
						<div className="w-full p-1">
							<Link
								href={option.path || ""}
								className={computeClassName(option)}
							>
								<span>{option.icon}</span>
								<span>{option.text}</span>
							</Link>
						</div>
					)}
					{option.type === adminDashboardStatus.PARENT && (
						<button
							className={`px-4 py-2 flex flex-col items-center gap-2 text-gray-200 text-sm`}
							onClick={() => handleShowTab(option)}
						>
							<div className="flex items-center gap-2">
								<span>{option.icon}</span>
								<span>{option.text}</span>
								<FaArrowDownShortWide />
							</div>

							{activeParentMenus.includes(option.id) && (
								<div className="flex flex-col">
									{option.subMenu?.map((sub) => (
										<Link
											href={sub.path}
											key={sub.id}
											className={clsx(
												"px-4 py-2 flex items-center gap-2 text-gray-200 text-sm rounded",
												{
													"bg-gray-500": sub.path === pathname,
													"hover:bg-gray-600": sub.path !== pathname,
												}
											)}
											onClick={(e) => e.stopPropagation()}
										>
											<div>{sub.text}</div>
										</Link>
									))}
								</div>
							)}
						</button>
					)}
				</Fragment>
			))}
		</div>
	)
}

export default AdminSidebar
