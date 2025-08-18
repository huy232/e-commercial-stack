// fonts.ts
import { Poppins, Anton, Inter, Montserrat, Bebas_Neue } from "next/font/google"

export const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	style: ["normal", "italic"],
	variable: "--font-poppins",
})

export const anton = Anton({
	subsets: ["latin"],
	weight: ["400"],
	display: "swap",
	variable: "--font-anton",
})

export const inter = Inter({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	style: ["normal"],
	variable: "--font-inter",
})

export const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	display: "swap",
	style: ["normal", "italic"],
	variable: "--font-montserrat",
})

export const bebasNeue = Bebas_Neue({
	subsets: ["latin"],
	weight: ["400"],
	display: "swap",
	style: ["normal"],
	variable: "--font-bebas-neue",
})
