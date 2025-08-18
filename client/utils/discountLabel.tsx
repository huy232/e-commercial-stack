import { formatPrice } from "./formatPrice"

export const discountLabel = (discount: { type: string; value: number }) => {
	if (discount.type === "percentage") {
		return (
			<div className="absolute top-0 left-0 leading-none text-[12px] lg:text-xs p-1 bg-red-500 rounded">
				<span>{discount.value}%</span>
			</div>
		)
	}
	if (discount.type === "fixed") {
		return (
			<div className="absolute top-0 left-0 leading-none text-[12px] lg:text-xs p-1 bg-yellow-500 rounded">
				<span>-{formatPrice(discount.value)}</span>
			</div>
		)
	}
}
