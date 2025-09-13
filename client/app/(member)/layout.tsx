import {
	ChatBox,
	Footer,
	Header,
	Navbar,
	ProfileSidebar,
	ScrollToTop,
	Toast,
} from "@/components"
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
							<div className="w-full xl:w-main flex-grow flex flex-col">
								<div className="flex max-[768px]:flex-col flex-row gap-1 w-full">
									<ProfileSidebar />
									{children}
								</div>
							</div>
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
