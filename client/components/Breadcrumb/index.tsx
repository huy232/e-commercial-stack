import { MdKeyboardArrowRight } from "@/assets/icons"
import clsx from "clsx"
import Link from "next/link"
import { FC } from "react"

interface BreadcrumbProps {
	breadcrumbs: { name: string; slug: string }[]
	productTitle?: string
	allowTitle: boolean
}

const Breadcrumb: FC<BreadcrumbProps> = ({
	breadcrumbs,
	productTitle,
	allowTitle,
}) => {
	const breadcrumbClass = clsx(
		`hover-effect hover:opacity-80 hover:underline-offset-2 hover:underline hover:text-rose-500`
	)

	const breadcrumbItems = breadcrumbs.map((breadcrumb, index) => {
		return (
			<>
				<span key={index} className="flex items-center justify-center">
					<Link href={breadcrumb.slug} className={breadcrumbClass}>
						{breadcrumb.name}
					</Link>
				</span>
				{index < breadcrumbs.length - 1 && (
					<span>
						<MdKeyboardArrowRight className="mb-[2px]" />
					</span>
				)}
			</>
		)
	})

	return (
		<div className="flex gap-1 items-center text-sm uppercase">
			{breadcrumbItems}
			{allowTitle && (
				<>
					<span>
						<MdKeyboardArrowRight className="mb-[2px]" />
					</span>
					<span className="select-none opacity-70">{productTitle}</span>
				</>
			)}
		</div>
	)
}

export default Breadcrumb
