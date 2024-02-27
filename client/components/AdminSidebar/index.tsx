"use client"
import { useEffect, useState } from "react"
import AdminMounted from "./AdminMounted"
const AdminSidebar = () => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}
	return mounted ? <AdminMounted /> : <></>
}
export default AdminSidebar
