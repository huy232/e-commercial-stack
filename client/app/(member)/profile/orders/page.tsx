import { Metadata } from "next"
import OrderComponent from "./_components/OrderComponent"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "My Orders | Digital World",
	description:
		"Track your Digital World orders. View order history, delivery status, and past purchases all in one place.",
	keywords: [
		"order history",
		"track orders",
		"purchase history",
		"Digital World orders",
		"delivery status",
	],
}

const UserOrderPage = () => {
	return <OrderComponent />
}

export default UserOrderPage
