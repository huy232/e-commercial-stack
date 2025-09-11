import dynamic from "next/dynamic"
import clsx from "clsx"
import { anton, bebasNeue, inter, poppins } from "@/utils"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider, ReduxProvider } from "@/context"
import { Toast } from "@/components"
import "../globals.css"

const ChatBox = dynamic(() => import("@/components/Chatbox"), {
	ssr: false,
})
const Footer = dynamic(() => import("@/components/Footer"), {
	ssr: false,
})
const Header = dynamic(() => import("@/components/Header"), {
	ssr: false,
})
const Navbar = dynamic(() => import("@/components/Navbar"), {
	ssr: false,
})
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), {
	ssr: false,
})

const bodyClassName = clsx(
	"w-full flex flex-col items-center min-h-screen",
	poppins.variable,
	anton.variable,
	inter.variable,
	bebasNeue.variable
)
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={bodyClassName}>
				<GoogleOAuthProvider
					clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
				>
					<ReduxProvider>
						<AuthProvider>
							<Header />
							<Navbar />
							<Toast />
							<div className="w-full xl:w-main flex-grow">{children}</div>
							<Footer />
							<div className="fixed bottom-2 right-0 max-sm:w-full md:bottom-4 md:right-4 flex flex-col-reverse gap-2 items-end z-10">
								<ChatBox />
								<ScrollToTop />
							</div>
						</AuthProvider>
					</ReduxProvider>
				</GoogleOAuthProvider>
			</body>
		</html>
	)
}
