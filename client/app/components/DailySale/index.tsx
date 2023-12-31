"use client"

import { getDailyDeal } from "@/app/api"
import { AiFillStar } from "@/assets/icons"
import { useCallback, useEffect, useState } from "react"
import { CustomImage, SaleCountdown } from "@/app/components"
import { DailyDealType } from "@/types"
import NoProductImage from "@/assets/images/no-product-image.png"
import { formatPrice, renderStarFromNumber } from "@/utils"
import Link from "next/link"
import { MdOutlineSubdirectoryArrowLeft } from "react-icons/md"
import moment from "moment"

const DailySale = () => {
	const [dailyDeal, setDailyDeal] = useState({
		loading: true,
		product: null as DailyDealType | null,
		expirationTime: "",
	})

	const fetchDealDaily = useCallback(async () => {
		try {
			const response = await getDailyDeal()
			if (response.data.success) {
				const product = response.data.dailyDeal.product
				const expirationTime = response.data.dailyDeal.expirationTime

				setDailyDeal({
					loading: false,
					product,
					expirationTime,
				})
			}
		} catch (error) {
			console.error("Error fetching daily deal:", error)
			setDailyDeal({
				loading: false,
				product: null,
				expirationTime: "",
			})
		}
	}, [])

	const fetchDealAtEndOfDay = useCallback(() => {
		const now = moment()
		const endOfDay = moment().endOf("day")
		const timeUntilEndOfDay = endOfDay.diff(now)

		setTimeout(() => {
			fetchDealDaily()
			fetchDealAtEndOfDay()
		}, timeUntilEndOfDay)
	}, [fetchDealDaily])

	useEffect(() => {
		fetchDealDaily()
		fetchDealAtEndOfDay()
	}, [fetchDealAtEndOfDay, fetchDealDaily])

	return (
		<div className="border w-full flex-auto">
			<h3 className="flex items-center justify-center gap-2">
				<span className="flex justify-center items-center">
					<AiFillStar size={20} color={"#ee3131"} />
				</span>
				<span className="font-bold text-lg flex items-center justify-center">
					DEAL DAILY
				</span>
			</h3>
			<div className="w-full flex flex-col items-center pt-4">
				{dailyDeal.loading && <p>Loading...</p>}
				{dailyDeal.product && (
					<>
						<div className="w-full">
							<CustomImage
								src={dailyDeal.product.thumbnail || NoProductImage}
								alt="Daily deal"
							/>
						</div>
						<div className="flex flex-col justify-center items-center w-full">
							<span className="line-clamp-2 text-center">
								{dailyDeal.product.title}
							</span>
							<span className="flex h-4">
								{renderStarFromNumber(dailyDeal.product.totalRatings, 20)}
							</span>
							<span>{formatPrice(dailyDeal.product.price)} VND</span>
							<SaleCountdown
								expirationTime={dailyDeal.expirationTime}
								onExpiration={fetchDealDaily}
							/>
							<div className="flex items-center w-full mt-4">
								<Link
									className="flex items-center justify-center gap-2 border-2 border-transparent bg-main p-2 mx-2 rounded w-full hover:opacity-80 hover:bg-white hover:border-main duration-200 ease-in-out"
									href={`/product/${dailyDeal.product.slug}`}
								>
									<span>Detail</span>
									<MdOutlineSubdirectoryArrowLeft />
								</Link>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default DailySale
