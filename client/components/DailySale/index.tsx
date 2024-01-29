"use client"
import { AiFillStar } from "@/assets/icons"
import { FC, useCallback, useEffect, useState } from "react"
import { CustomImage, SaleCountdown } from "@/components"
import { DailyDealType } from "@/types"
import NoProductImage from "@/assets/images/no-product-image.png"
import { formatPrice, renderStarFromNumber } from "@/utils"
import Link from "next/link"
import { MdOutlineSubdirectoryArrowLeft } from "react-icons/md"
import moment from "moment"

interface DailySaleProps {
	dailySale: any
}

const DailySale: FC<DailySaleProps> = ({ dailySale }) => {
	const [mounted, setMounted] = useState(false)
	const [dailyDeal, setDailyDeal] = useState({
		loading: true,
		product: null as DailyDealType | null,
		expirationTime: "",
	})

	const fetchDealDaily = useCallback(async () => {
		try {
			if (dailySale.success) {
				const product = dailySale.data
				const expirationTime = dailySale.expirationTime
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
	}, [dailySale])

	const fetchDealAtEndOfDay = useCallback(() => {
		const now = moment()
		const timeUntilEndOfDay = moment(dailyDeal.expirationTime).diff(now)

		setTimeout(() => {
			fetchDealDaily()
			fetchDealAtEndOfDay()
		}, timeUntilEndOfDay)
	}, [dailyDeal.expirationTime, fetchDealDaily])

	useEffect(() => {
		fetchDealDaily()
		if (dailyDeal.expirationTime) {
			fetchDealAtEndOfDay()
		}
	}, [dailyDeal.expirationTime, fetchDealAtEndOfDay, fetchDealDaily])

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

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
							{mounted ? (
								<SaleCountdown
									expirationTime={dailyDeal.expirationTime}
									onExpiration={fetchDealDaily}
								/>
							) : (
								<></>
							)}

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
