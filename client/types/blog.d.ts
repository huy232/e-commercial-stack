export type Blog = {
	_id: Types.ObjectId
	title: string
	description: string
	numberViews: number
	likes: Types.ObjectId[]
	dislikes: Types.ObjectId[]
	image: string
	author: Types.ObjectId
	relatedProducts: Types.ObjectId[]
	relatedBlogCategory: Types.ObjectId
	updatedAt: Date
	createdAt: Date
	slug: string
}

export type PopulatedBlog = Omit<Blog, "author" | "relatedProducts"> & {
	author: {
		_id: string
		firstName: string
		lastName: string
		avatar: string
	}
	relatedProducts: {
		_id: string
		title: string
		thumbnail: string
		price: number
		slug: string
	}[]
	relatedBlogCategory: {
		_id: string
		name: string
		slug: string
		image: string
		description: string
		createdAt: Date
		updatedAt: Date
	}
}
