import { AiFillStar, AiOutlineStar } from "@/assets/icons"

export const renderStarFromNumber = (number: number): JSX.Element[] => {
	if (!Number(number)) return []
	const stars: JSX.Element[] = []
	for (let i = 0; i < number; i++) {
		stars.push(<AiFillStar />)
	}
	for (let i = 5; i > number; i--) {
		stars.push(<AiOutlineStar />)
	}
	return stars
}
