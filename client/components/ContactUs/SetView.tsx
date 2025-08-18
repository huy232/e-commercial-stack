"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"

export default function SetView({
	coords,
	zoom,
}: {
	coords: [number, number]
	zoom: number
}) {
	const map = useMap()

	useEffect(() => {
		if (map) {
			map.setView(coords, zoom)
		}
	}, [coords, zoom, map])

	return null
}
