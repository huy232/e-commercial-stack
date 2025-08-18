import type { Metadata } from "next"
import { ChatBox, Footer, Header, Navbar, Toast } from "@/components"
import clsx from "clsx"
import { anton, bebasNeue, inter, poppins } from "@/utils"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider, ReduxProvider } from "@/context"
import "../globals.css"

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
							<ChatBox />
							<div className="w-full lg:w-main flex-grow">{children}</div>
							<Footer />
						</AuthProvider>
					</ReduxProvider>
				</GoogleOAuthProvider>
			</body>
		</html>
	)
}
