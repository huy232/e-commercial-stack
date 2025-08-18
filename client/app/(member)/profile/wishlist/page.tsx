import { Metadata } from "next"
import dynamic from "next/dynamic"

const WishlistComponent = dynamic(
	() => import("@/components/WishlistComponent"),
	{
		ssr: false,
	}
)

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
