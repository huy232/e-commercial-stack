import { navigation } from "@/utils/navigation"
import Link from "next/link"
import { useRouter } from "next/router"
import clsx from "clsx"

export const Navbar = () => {
	const router = useRouter()

	return (
		<div className="w-main h-[48px] py-2 border text-sm flex items-center">
			{navigation.map((nav) => {
				const linkClasses = clsx(
					"pr-12 hover:text-main",
					{
						"text-main": router.pathname === nav.path,
					},
					{
						"text-black": router.pathname !== nav.path,
					}
				)

				return (
					<Link key={nav.id} href={nav.path}>
						<a className={linkClasses}>{nav.value}</a>
					</Link>
				)
			})}
		</div>
	)
}
