"use client"

import dynamic from "next/dynamic"

const MapComponent = dynamic(() => import("./MapComponent"), {
	ssr: false,
	loading: () => <p>Loading map...</p>,
})

export default function ContactUs() {
	return (
		<div className="w-full h-[500px]">
			<MapComponent />
		</div>
	)
}
