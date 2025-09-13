"use client"

import { profileSidebarOptions } from "@/constant"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components"
import { Fragment, memo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PanelLeft } from "lucide-react"

const ProfileSidebar = () => {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	const optionClass = (path: string) =>
		clsx(
			`p-2 text-left m-1 border-[1px] rounded flex items-center gap-2 hover-effect hover:bg-red-500 hover:text-white`,
			pathname === path ? "border-red-500" : "border-transparent"
		)

	return (
		<div className="relative mt-2 lg:mt-4 lg:mx-2">
			{/* Toggle Button */}
			<Button
				onClick={() => setOpen(true)}
				className="font-bebasNeue p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-black/40 duration-300 ease-in-out lg:hidden flex items-center gap-2 mx-2"
				aria-label="Open profile sidebar"
				role="button"
				tabIndex={0}
				data-testid="open-profile-sidebar-button"
				id="open-profile-sidebar-button"
				disabled={open}
				loading={open}
			>
				<PanelLeft size={20} />
				<span className="font-semibold">Profile</span>
			</Button>

			{/* Sidebar for desktop */}
			<div className="hidden lg:block w-32 border-r p-2">
				{profileSidebarOptions.map((option) => (
					<Fragment key={option.id}>
						<Link href={option.path || ""} className={optionClass(option.path)}>
							<span>{option.icon}</span>
							<span>{option.text}</span>
						</Link>
					</Fragment>
				))}
			</div>

			{/* Mobile sidebar */}
			<AnimatePresence>
				{open && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.4 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.15 }} // faster than sidebar
							className="fixed inset-0 bg-black z-40"
							onClick={() => setOpen(false)}
						/>

						{/* Sidebar */}
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "tween", duration: 0.3 }}
							className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-2"
						>
							{/* Close button */}
							<Button
								onClick={() => setOpen(false)}
								className="p-2 mb-2 rounded-md border border-gray-300 hover:bg-gray-100"
								aria-label="Close profile sidebar"
								role="button"
								tabIndex={0}
								data-testid="close-profile-sidebar-button"
								id="close-profile-sidebar-button"
								disabled={!open}
								loading={!open}
							>
								Close
							</Button>

							{profileSidebarOptions.map((option) => (
								<Fragment key={option.id}>
									<Link
										href={option.path || ""}
										className={optionClass(option.path)}
										onClick={() => setOpen(false)}
									>
										<span>{option.icon}</span>
										<span>{option.text}</span>
									</Link>
								</Fragment>
							))}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	)
}

export default memo(ProfileSidebar)
