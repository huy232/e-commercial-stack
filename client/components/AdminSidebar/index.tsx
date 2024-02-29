"use client"
import { Fragment, useState } from "react"
import { useLayoutEffect } from "react"
import { useSelector } from "react-redux"
import { selectIsAdmin, selectIsAuthenticated } from "@/store/slices/authSlice"
import { adminSidebarOptions } from "@/constant"
import { adminDashboardStatus } from "@/types/adminDashboard"
import Link from "next/link"
const AdminSidebar = () => {
	return (
		<div>
			{adminSidebarOptions.map((option) => (
				<Fragment key={option.id}>
					{option.type === adminDashboardStatus.SINGLE && (
						<Link href={option.path || ""} className="flex items-center gap-1">
							<span>{option.icon}</span>
							<span>{option.text}</span>
						</Link>
					)}
				</Fragment>
			))}
		</div>
	)
}

export default AdminSidebar
