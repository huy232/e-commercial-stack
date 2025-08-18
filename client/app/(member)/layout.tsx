import { Footer, Header, Navbar, ProfileSidebar, Toast } from "@/components"
import clsx from "clsx"
import { AuthProvider, ReduxProvider } from "@/context"
import "../globals.css"
import { anton, bebasNeue, inter, poppins } from "@/utils"

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
				<ReduxProvider>
					<AuthProvider>
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
					</AuthProvider>
				</ReduxProvider>
			</body>
		</html>
	)
}
