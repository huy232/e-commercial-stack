import { Footer, Header, Navbar, ProfileSidebar, Toast } from "@/components"
import ReduxProvider from "@/context/reduxProvider"
import clsx from "clsx"
import { Poppins } from "next/font/google"
import "../globals.css"

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	style: ["normal", "italic"],
})

export const metadata = {
	title: "Next.js",
	description: "Generated by Next.js",
}

const bodyClassName = clsx(
	"w-full flex flex-col items-center min-h-screen",
	poppins.className
)
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={bodyClassName}>
				<ReduxProvider>
					<Header />
					<Navbar />
					<Toast />
					<div className="w-main flex-grow">
						<div className="flex gap-1">
							<ProfileSidebar />
							{children}
						</div>
					</div>
					<Footer />
				</ReduxProvider>
			</body>
		</html>
	)
}
