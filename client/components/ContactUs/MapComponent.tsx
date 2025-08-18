"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"
import { useMap } from "react-leaflet"

function SetView({ coords, zoom }: { coords: [number, number]; zoom: number }) {
	const map = useMap()
	useEffect(() => {
		map.setView(coords, zoom)
	}, [coords, zoom, map])
	return null
}

const customMarker = new L.Icon({
	iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
	iconSize: [35, 35],
})

export default function MapComponent() {
	const center: [number, number] = [10.7769, 106.7009]
	const zoom = 13

	return (
		<MapContainer
			style={{ height: "100%", width: "100%" }}
			center={center}
			zoom={zoom}
		>
			<SetView coords={center} zoom={zoom} />
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<Marker position={center} icon={customMarker}>
				<Popup>Our Store Location</Popup>
			</Marker>
		</MapContainer>
	)
}
