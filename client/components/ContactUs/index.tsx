"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { motion } from "framer-motion"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import markerShadowPng from "leaflet/dist/images/marker-shadow.png"
import L from "leaflet"

const center: [number, number] = [37.7749, -122.4194] // Update with your location
const zoom = 13

// Component to set map center and zoom dynamically
function SetView({ coords, zoom }: { coords: [number, number]; zoom: number }) {
	const map = useMap()
	useEffect(() => {
		map.setView(coords, zoom)
	}, [coords, zoom, map])
	return null
}

export default function ContactUs() {
	// Form state
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	})

	const customMarker = new L.Icon({
		iconUrl: markerIconPng.src,
		shadowUrl: markerShadowPng.src,
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log("Form submitted:", formData)
		// Handle form submission logic (e.g., send to API)
	}

	return (
		<motion.main
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			className="w-main mx-auto p-6 space-y-6"
		>
			<h2 className="text-3xl font-bold text-center">Contact Us</h2>
			<p className="text-center text-gray-600">
				Reach out to us for any inquiries or visit our location below.
			</p>

			{/* MAP SECTION */}
			<div className="w-full h-[400px] rounded-lg overflow-hidden shadow-md">
				<MapContainer style={{ height: "100%", width: "100%" }}>
					<SetView coords={center} zoom={zoom} />
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<Marker position={center} icon={customMarker}>
						<Popup>Our Store Location</Popup>
					</Marker>
				</MapContainer>
			</div>

			{/* TWO COLUMNS */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* LEFT COLUMN - CONTACT INFO */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="p-6 border rounded-lg shadow-md bg-white"
				>
					<h3 className="text-xl font-semibold mb-4">Our Information</h3>
					<p>
						<strong>📍 Address:</strong> 474 Ontario St, Toronto, ON M4X 1M7
						Canada
					</p>
					<p className="mt-2">
						<strong>⏰ Opening Hours:</strong>
						<br />
						Mon-Fri: 11.00 - 20.00
						<br />
						Sat: 10.00 - 20.00
						<br />
						Sun: 19.00 - 20.00
					</p>
					<p className="mt-2">
						<strong>📧 Email:</strong> support@tadathemes.com
					</p>
					<p className="mt-2">
						<strong>📞 Phone:</strong> (+123) 345 678 xxx
					</p>
				</motion.div>

				{/* RIGHT COLUMN - CONTACT FORM */}
				<motion.form
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					className="p-6 border rounded-lg shadow-md bg-white space-y-4"
					onSubmit={handleSubmit}
				>
					<h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
					<input
						type="text"
						name="name"
						placeholder="Your Name"
						value={formData.name}
						onChange={handleChange}
						required
						className="w-full p-2 border rounded-lg"
					/>
					<input
						type="email"
						name="email"
						placeholder="Your Email"
						value={formData.email}
						onChange={handleChange}
						required
						className="w-full p-2 border rounded-lg"
					/>
					<input
						type="tel"
						name="phone"
						placeholder="Your Phone (Optional)"
						value={formData.phone}
						onChange={handleChange}
						className="w-full p-2 border rounded-lg"
					/>
					<textarea
						name="message"
						placeholder="Your Message"
						value={formData.message}
						onChange={handleChange}
						required
						className="w-full p-2 border rounded-lg h-32 resize-none"
					/>
					<button
						type="submit"
						className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
					>
						Send Message
					</button>
				</motion.form>
			</div>
		</motion.main>
	)
}
