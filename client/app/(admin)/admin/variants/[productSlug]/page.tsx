import { getProductCategory, getSpecificProduct } from "@/app/api"
import { ManageUserList, UpdateProduct } from "@/components"
import ProductVariant from "@/components/ProductVariant"

type Props = {
	params: {
		productSlug: string
	}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminProductVariant(props: Props) {
	const { productSlug } = props.params
	const productResponse = await getSpecificProduct(productSlug)
	return (
		<main>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Add product variants
			</h1>
			<ProductVariant productResponse={productResponse} />
		</main>
	)
}
