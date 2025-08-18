"use client"

import { introduceList, introduceMainTitle } from "@/constant/introduce"
import clsx from "clsx"

const textColors = [
	"text-teal-500",
	"text-yellow-500",
	"text-red-500",
	"text-purple-500",
	"text-blue-500",
	"text-indigo-500",
	"text-orange-500",
]

const backgroundColors = [
	"hover:bg-teal-500",
	"hover:bg-yellow-500",
	"hover:bg-red-500",
	"hover:bg-purple-500",
	"hover:bg-blue-500",
	"hover:bg-indigo-500",
	"hover:bg-orange-500",
]

const Introduce = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
			<div className="lg:col-span-1 row-span-2 px-2 flex flex-col justify-center						">
				<h1 className="text-3xl font-bold mb-2 font-bebasNeue">
					{introduceMainTitle.title}
				</h1>
				<p className="text-sm text-gray-500 italic pl-2">
					{introduceMainTitle.description}
				</p>
			</div>
			{introduceList.map((introduce, index) => (
				<div
					key={index}
					className={clsx(
						`${backgroundColors[index]}`,
						"my-2 shadow-md p-4 rounded group duration-500 ease-in-out transition-all cursor-default"
					)}
				>
					<div
						className={clsx(
							"text-3xl mb-2 flex gap-2",
							textColors[index],
							"group-hover:text-white"
						)}
					>
						{introduce.icon}
						<h2 className="font-semibold text-lg font-anton">
							{introduce.title}
						</h2>
					</div>
					<p className="text-sm text-gray-500 italic font-inter group-hover:brightness-150 group-hover:text-white">
						{introduce.description}
					</p>
				</div>
			))}
		</div>
	)
}

export default Introduce
