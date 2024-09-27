"use client"
import { brandDemonstrate } from "@/constant"
import { CustomImage } from "@/components"
import clsx from "clsx"

const Brand = () => (
	<div className="flex flex-col overflow-hidden">
		<div className="relative w-full">
			<ul className="flex w-max gap-10 animate-infinite-horizontal-scroll">
				{/* Duplicate items to ensure seamless scrolling */}
				{[...brandDemonstrate, ...brandDemonstrate].map((brand, index) => (
					<li key={`${brand.id}-${index}`} aria-label={`Brand ${brand.id}`}>
						<CustomImage
							src={brand.icon}
							alt={`Brand ${brand.id}`}
							width={80}
							height={80}
						/>
					</li>
				))}
			</ul>
		</div>
	</div>
)

export default Brand
