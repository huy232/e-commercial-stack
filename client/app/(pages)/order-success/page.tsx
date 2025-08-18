"use client"
import { CustomImage } from "@/components"
import { API } from "@/constant"
import { OrderType } from "@/types"
import { formatPrice } from "@/utils"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

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
