import clsx from "clsx"

export const inputClass = (additionalClassName: string = "") =>
	clsx(
		"placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md p-1 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow",
		additionalClassName
	)
