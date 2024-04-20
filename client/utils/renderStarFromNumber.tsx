import { AiFillStar, AiOutlineStar, FaStarHalfAlt } from "@/assets/icons"

export const renderStarFromNumber = (
	number: number = 0,
	size: number = 16,
	color: string = "orange"
): JSX.Element[] => {
	if (isNaN(number)) return []

	const stars: JSX.Element[] = []
	const fullStars = Math.floor(number)
	const hasHalfStar = number - fullStars >= 0.5
	for (let i = 0; i < fullStars; i++) {
		stars.push(<AiFillStar key={i} color={color} size={size} />)
	}

	if (hasHalfStar) {
		stars.push(<FaStarHalfAlt key={fullStars} color={color} size={size} />)
	}

	for (let i = stars.length; i < 5; i++) {
		stars.push(<AiOutlineStar key={i} color={color} size={size} />)
	}

	return stars
}
