import { Users } from "@/types"

export const userHeaders = [
	{ title: "#", key: "number" },
	{ title: "Email", key: "email" },
	{ title: "First Name", key: "firstName" },
	{ title: "Last Name", key: "lastName" },
	{ title: "Role", key: "role" },
	{ title: "Phone", key: "phone" },
	{ title: "Status", key: "status" },
	{ title: "Created at", key: "createdAt" },
	{ title: "Action", key: "action" },
]

export const sortableUserFields: (keyof Users)[] = [
	"email",
	"firstName",
	"lastName",
]

export const productHeaders: {
	title: string
	key: string
	align?: "left" | "center" | "right"
}[] = [
	{ title: "#", key: "number", align: "center" },
	{ title: "Thumbnail", key: "thumbnail", align: "center" },
	{ title: "Product name", key: "productName", align: "center" },
	{ title: "Category", key: "category", align: "center" },
	{ title: "Brand", key: "brand", align: "center" },
	{ title: "Price", key: "price", align: "center" },
	{ title: "Discount", key: "discount", align: "center" },
	{ title: "Stock", key: "stock", align: "center" },
	{ title: "Created at", key: "createdAt", align: "center" },
	{ title: "Actions", key: "actions", align: "center" },
]

export const sortableProductFields = [
	"productName",
	"category",
	"brand",
	"price",
	"discount",
	"stock",
	"createdAt",
]

export const orderHeaders: {
	title: string
	key: string
	align?: "left" | "center" | "right"
}[] = [
	{ title: "#", key: "number", align: "center" },
	{ title: "Order ID", key: "orderId" },
	{ title: "User", key: "firstName" },
	{ title: "Shipment status", key: "status" },
	{ title: "Coupon", key: "coupon" },
	{ title: "Bill payment", key: "total", align: "right" },
	{ title: "Date", key: "date", align: "right" },
]

export const sortableOrderFields = ["firstName", "status", "total", "date"]
