import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			boxShadow: {
				heavy:
					"rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
			},
			fontFamily: {
				poppins: ["var(--font-poppins)", ...fontFamily.sans],
				anton: ["var(--font-anton)", ...fontFamily.sans],
				inter: ["var(--font-inter)", ...fontFamily.sans],
				bebasNeue: ["var(--font-bebas-neue)", ...fontFamily.sans],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			width: {
				main: "1280px",
			},
			backgroundColor: {
				main: "#ee3131",
			},
			colors: {
				main: "#ee3131",
			},
			flex: {
				"2": "2 2 0%",
				"3": "3 3 0%",
				"4": "4 4 0%",
				"5": "5 5 0%",
				"6": "6 6 0%",
				"7": "7 7 0%",
				"8": "8 8 0%",
			},
			keyframes: {
				"slide-up": {
					"0%": {
						opacity: "0",
						transform: "translateY(0)",
					},
					"100%": {
						opacity: "1",
						transform: "translateY(-20px)",
					},
				},
				"infinite-horizontal-scroll": {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(calc(-50% + 10px))" },
				},
				marquee: {
					"0%": { transform: "translateX(0%)" },
					"100%": { transform: "translateX(-100%)" },
				},
				marquee2: {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0%)" },
				},
				tada: {
					"0%": {
						transform: "scale3d(1, 1, 1)",
					},
					"10%, 20%": {
						transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)",
					},
					"30%, 50%, 70%, 90%": {
						transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)",
					},
					"40%, 60%, 80%": {
						transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)",
					},
					"100%": {
						transform: "scale3d(1, 1, 1)",
					},
				},
			},
			animation: {
				"slide-up":
					"slide-up 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
				paused: "paused",
				"infinite-horizontal-scroll":
					"infinite-horizontal-scroll 40s linear infinite",
				marquee: "marquee 25s linear infinite",
				marquee2: "marquee2 25s linear infinite",
				tada: "tada 1s ease-in-out 0.25s 1",
			},
			listStyleType: {
				none: "none",
				disc: "disc",
				decimal: "decimal",
				square: "square",
				roman: "upper-roman",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
	important: true,
}
export default config
