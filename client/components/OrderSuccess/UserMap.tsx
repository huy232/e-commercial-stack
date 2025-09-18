import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"

// ---- Map Helper ----
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

interface MapComponentProps {
	address: {
		lat: number
		lng: number
		label: string
	}
}

function UserMap({ address }: MapComponentProps) {
	const coords: [number, number] = [address.lat, address.lng]
	return (
		<div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200 mt-4">
			<MapContainer
				style={{ height: "100%", width: "100%" }}
				center={coords}
				zoom={13}
				scrollWheelZoom={false}
			>
				<SetView coords={coords} zoom={13} />
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<Marker position={coords} icon={customMarker}>
					<Popup>{address.label}</Popup>
				</Marker>
			</MapContainer>
		</div>
	)
}

export default UserMap
