"use client"

import { profileSidebarOptions } from "@/constant"
import Link from "next/link"
import { Fragment } from "react"
type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}
const Profile = (props: Props) => {
	console.log(props.searchParams)
	return (
		<div className="flex gap-2">
			<div>
				{profileSidebarOptions.map((option) => (
					<Fragment key={option.id}>
						<div className="w-full p-1">
							<Link href={option.path || ""} className="">
								<span>{option.icon}</span>
								<span>{option.text}</span>
							</Link>
						</div>
					</Fragment>
				))}
			</div>
			<div>CONTENT</div>
		</div>
	)
}
export default Profile
