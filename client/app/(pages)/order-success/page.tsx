import dynamic from "next/dynamic"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

const OrderSuccess = dynamic(() => import("@/components/OrderSuccess"), {
	ssr: false,
})

export default function UserOrderPage(props: Props) {
	const orderId = props.searchParams.orderId as string | undefined

	return <OrderSuccess orderId={orderId as string} />
}
