import { MdKeyboardArrowRight } from "@/assets/icons"
import clsx from "clsx"
import Link from "next/link"
import { FC, Fragment } from "react"

interface BreadcrumbProps {
	categories: string[]
	productTitle: string
}

const Breadcrumb: FC<BreadcrumbProps> = ({ categories, productTitle }) => {
	const breadcrumbClass = clsx(
		`hover-effect hover:opacity-80 hover:underline-offset-2 hover:underline hover:text-rose-500`
	)
	const breadcrumbItems = categories.map((category, index) => {
		if (category === "Home") {
			return (
				<Fragment key={index}>
					<Link className={breadcrumbClass} href="/">
						Home
					</Link>
					<span>
						<MdKeyboardArrowRight />
					</span>
				</Fragment>
			)
		}
		const path = `/products?type=${encodeURIComponent(category)}`
		return (
			<Fragment key={index}>
				<Link className={breadcrumbClass} href={path}>
					{category}
				</Link>
				<span>
					<MdKeyboardArrowRight />
				</span>
			</Fragment>
		)
	})
	return (
		<div className="flex gap-1 items-center text-sm">
			{breadcrumbItems}
			<span className="select-none opacity-70">{productTitle}</span>
		</div>
	)
}
export default Breadcrumb
