"use client"

import { introduceList, introduceMainTitle } from "@/constant/introduce"
import clsx from "clsx"

const colors = [
	"text-teal-500",
	"text-yellow-500",
	"text-red-500",
	"text-purple-500",
	"text-blue-500",
	"text-indigo-500",
	"text-orange-500",
]

const Introduce = () => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
			{/* Main title section spanning two columns */}
			<div className="col-span-2 md:col-span-1 row-span-2">
				<h1 className="text-3xl font-bold mb-2">{introduceMainTitle.title}</h1>
				<p className="text-sm text-gray-500 italic">
					{introduceMainTitle.description}
				</p>
			</div>

			{/* Map over introduceList and display each item */}
			{introduceList.map((introduce, index) => (
				<div key={index} className="bg-white shadow-md p-4 rounded">
					{/* Apply dynamic color from colors array using clsx */}
					<div className={clsx("text-3xl mb-2", colors[index % colors.length])}>
						{introduce.icon}
					</div>
					<h2 className="font-semibold text-lg">{introduce.title}</h2>
					<p className="text-sm text-gray-500">{introduce.description}</p>
				</div>
			))}
		</div>
	)
}

export default Introduce
