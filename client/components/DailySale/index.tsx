"use client"
import { AiFillStar } from "@/assets/icons"
import { FC, useCallback, useEffect, useState } from "react"
import { CustomImage, SaleCountdown } from "@/components"
import { DailyDealType, ProductExtraType } from "@/types"
import NoProductImage from "@/assets/images/no-product-image.png"
import {
	discountLabel,
	discountValidate,
	formatPrice,
	renderStarFromNumber,
} from "@/utils"
import Link from "next/link"
import { MdOutlineSubdirectoryArrowLeft } from "react-icons/md"
import moment from "moment"
import { API, WEB_URL } from "@/constant"

interface DailySaleProps {
	dailySale: {
		data: ProductExtraType
		success: boolean
		expirationTime: string
	}
}

const DailySale: FC<DailySaleProps> = ({ dailySale }) => {
	const [dailyDeal, setDailyDeal] = useState<ProductExtraType | null>(
		dailySale.data
	)
	const [expirationDate, setExpirationDate] = useState<string>(
		dailySale.expirationTime
	)
	const [loading, setLoading] = useState<boolean>(
		dailySale.success ? false : true
	)

	const fetchDealDaily = useCallback(async () => {
		try {
			setLoading(true)
			const response = await fetch(WEB_URL + `/api/product/daily-product`, {
				method: "GET",
				cache: "no-cache",
			})
			const data = await response.json()

			if (data.success) {
				setDailyDeal(data.data)
				setExpirationDate(data.expirationTime)
			} else {
				console.error("Failed to fetch daily deal:", data.message)
				setDailyDeal(null)
			}
		} catch (error) {
			console.error("Error fetching daily deal:", error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		if (moment().isAfter(moment(expirationDate))) {
			fetchDealDaily()
		}
	}, [expirationDate, fetchDealDaily])

	if (loading) {
		return <div>Loading</div>
	}

	return (
		<div className="w-full md:w-1/3">
			<h3 className="flex items-center justify-center gap-2 flex-col">
				<span className="text-3xl font-black leading-snug text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-600 to-purple-600 flex items-center justify-center uppercase font-bebasNeue -skew-y-6">
					You might like?!
				</span>
				<SaleCountdown
					expirationTime={expirationDate}
					onExpiration={fetchDealDaily}
				/>
			</h3>
			<div className="w-full flex flex-col items-center">
				{dailyDeal && (
					<>
						<div className="relative w-[200px] h-[200px] mt-2">
							<CustomImage
								src={dailyDeal.thumbnail || NoProductImage}
								alt="Daily deal"
								fill
								className="object-contain rounded-lg shadow-lg"
							/>
							{dailyDeal.discount.type === "fixed" && (
								<span className="absolute text-[12px] bg-orange-500 font-bold rounded text-white px-1 top-1 right-1">
									-{formatPrice(dailyDeal.discount.value)}
								</span>
							)}
							{dailyDeal.discount.type === "percentage" && (
								<span className="absolute text-[12px] bg-red-500 font-bold rounded text-white px-1 top-1 right-1">
									-{dailyDeal.discount.value}%
								</span>
							)}
						</div>
						<div className="flex flex-col justify-center items-center w-full">
							<span className="line-clamp-2 text-center font-bold text-md lg:text-base font-inter">
								{dailyDeal.title}
							</span>
							<span className="flex h-4">
								{renderStarFromNumber(dailyDeal.totalRatings, 20)}
							</span>
							<span className="text-sm mt-2">
								{discountValidate(dailyDeal) ? (
									<div className="flex flex-col items-center">
										<span className="text-gray-500 text-[14px] line-through">
											{formatPrice(dailyDeal.price)}
										</span>
										<span className="text-green-500 text-sm text-center">
											{formatPrice(dailyDeal.discount.productPrice)}
										</span>
									</div>
								) : (
									<span className="text-green-500 text-sm text-center">
										{formatPrice(dailyDeal.price)}
									</span>
								)}
							</span>
							<div className="w-full mt-2">
								<Link
									className="mx-auto flex items-center justify-center gap-1 rounded-md bg-gradient-to-tr from-indigo-600 via-purple-500 to-red-500 hover:from-red-500 hover:to-indigo-600	ease-in-out p-2 font-inter text-base font-bold transition-all duration-300 max-w-[100px] hover:max-w-[160px] delay-200"
									href={`/products/${dailyDeal.slug}`}
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
