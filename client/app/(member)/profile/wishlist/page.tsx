import { Metadata } from "next"
import WishlistComponent from "./_components/WishlistComponent"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "My Wishlist | Digital World",
	description:
		"View and manage your wishlist at Digital World. Save your favorite tech products and keep track of items you want to purchase later.",
	keywords: [
		"wishlist",
		"saved products",
		"favorite electronics",
		"Digital World wishlist",
		"shopping list",
	],
}

const ProfileWishlist = (props: Props) => {
	return <WishlistComponent />
}

export default ProfileWishlist
