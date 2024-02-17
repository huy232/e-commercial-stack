import type { Config } from "tailwindcss"

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			width: {
				main: "1220px",
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
			},
			animation: {
				"slide-up":
					"slide-up 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both",
			},
			listStyleType: {
				none: "none",
				disc: "disc",
				decimal: "decimal",
				square: "square",
				roman: "upper-roman",
			},
		},
		listStyleType: {
			none: "none",
			disc: "disc",
			decimal: "decimal",
			square: "square",
			roman: "upper-roman",
		},
	},
	plugins: [require("@tailwindcss/forms")({ strategy: "class" })],
	important: true,
}
export default config
