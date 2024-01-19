import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Footer, Header, Navbar, TopHeader } from "@/app/components"
import clsx from "clsx"
import ReduxProvider from "@/app/context/reduxProvider"
import "../app/globals.css"

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	style: ["normal", "italic"],
})

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
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
					<TopHeader />
					<Header />
					<Navbar />
					<div className="w-main flex-grow">{children}</div>
					<Footer />
				</ReduxProvider>
			</body>
		</html>
	)
}
