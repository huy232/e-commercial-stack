import { AiFillStar, AiOutlineStar } from "@/assets/icons"

export const renderStarFromNumber = (
	number: number = 0,
	size: number = 16
): JSX.Element[] => {
	if (!Number(number)) return []

	const stars: JSX.Element[] = []
	for (let i = 0; i < number; i++) {
		stars.push(<AiFillStar key={i} color="orange" size={size} />)
	}
	for (let i = 5; i > number; i--) {
		stars.push(<AiOutlineStar key={i} color="orange" size={size} />)
	}

	return stars
}
