import mongoose from "mongoose"
import { NotifyService } from ".."
import { Notify, Product, Wishlist } from "../../models"

class WishlistService {
	async addOrRemoveItem(userId: string, productId: string, io: any) {
		const productObjectId = new mongoose.Types.ObjectId(productId)
		const wishlistUser = await Wishlist.findOne({ user_id: userId })

		if (!wishlistUser) {
			const wishlistItem = await Wishlist.create({
				user_id: userId,
				items: [{ product_id: productObjectId }],
			})
			await this.notifyIfOnSale(userId, productObjectId, io)
			return { message: "Item added to wishlist", data: wishlistItem.items }
		}

		if (!wishlistUser.items) wishlistUser.items = []

		const itemIndex = wishlistUser.items.findIndex(
			(item) => item.product_id?.toString() === productId
		)

		if (itemIndex !== -1) {
			wishlistUser.items.splice(itemIndex, 1)
			const wishlistItem = await wishlistUser.save()
			return { message: "Item removed from wishlist", data: wishlistItem.items }
		}

		wishlistUser.items.push({ product_id: productObjectId })
		const wishlistItem = await wishlistUser.save()
		await this.notifyIfOnSale(userId, productObjectId, io)

		return { message: "Item added to wishlist", data: wishlistItem.items }
	}

	private async notifyIfOnSale(
		userId: string,
		productId: mongoose.Types.ObjectId,
		io: any
	) {
		const product = await Product.findById(productId)

		if (
			product &&
			product.discount?.expirationDate &&
			new Date(product.discount.expirationDate) > new Date() &&
			product.discount.value < product.price
		) {
			await NotifyService.createNotification(
				userId,
				`The product "${product.title}" is currently on sale!`,
				productId.toString(),
				io
			)
		}
	}
}

export default new WishlistService()
