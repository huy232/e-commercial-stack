import { Footer, Header, Navbar, ProfileSidebar, Toast } from "@/components"
import clsx from "clsx"
import { AuthProvider, ReduxProvider } from "@/context"
import "../globals.css"
import { anton, bebasNeue, inter, poppins } from "@/utils"
import { GoogleOAuthProvider } from "@react-oauth/google"

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
							<div className="w-full xl:w-main flex-grow">
								<div className="flex flex-col md:flex-row gap-1">
									<ProfileSidebar />
									{children}
								</div>
							</div>
							<Footer />
						</AuthProvider>
					</ReduxProvider>
				</GoogleOAuthProvider>
			</body>
		</html>
	)
}
