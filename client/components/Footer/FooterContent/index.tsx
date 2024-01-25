import clsx from "clsx"
import Link from "next/link"

const FooterContent = () => {
	const headingClassName = clsx(
		`mb-[20px] text-sm font-bold border-l-2 border-main pl-2 uppercase`
	)

	return (
		<div className="w-full flex items-center justify-center bg-black/90 text-white text-xs py-4">
			<div className="w-main flex">
				<div className="flex-2 flex flex-col gap-2">
					<h3 className={headingClassName}>About us</h3>
					<div>
						<span>Address: </span>
						<span className="opacity-50">
							474 Ontario St Toronto, ON M4X 1M7 Canada
						</span>
					</div>
					<div>
						<span>Phone: </span>
						<span className="opacity-50">(+1234)56789xxx</span>
					</div>
					<div>
						<span> Mail: </span>
						<span className="opacity-50">digitalworld@gmail.com</span>
					</div>
				</div>
				<div className="flex-1">
					<h3 className={headingClassName}>Information</h3>
					<div className="flex flex-col gap-2">
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Typography
						</Link>
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Gallery
						</Link>
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Store location
						</Link>
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Today&apos; deal
						</Link>
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Contacts
						</Link>
					</div>
				</div>
				<div className="flex-1">
					<h3 className={headingClassName}>Who we are</h3>
					<div className="flex flex-col gap-2">
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Help
						</Link>
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Free shipping
						</Link>
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							FAQs
						</Link>
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Return & exchange
						</Link>
						<Link
							href={"#"}
							className="hover:opacity-70 hover:text-main hover-effect"
						>
							Testimonials
						</Link>
					</div>
				</div>
				<div className="flex-1">
					<h3 className={headingClassName}>Digital World</h3>
				</div>
			</div>
		</div>
	)
}

export default FooterContent
