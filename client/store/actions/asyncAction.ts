import { createAsyncThunk } from "@reduxjs/toolkit"
import { getProductCategories } from "@/app/api"

export const getCategoriesAction = createAsyncThunk(
	"app/categories",
	async (data, { rejectWithValue }) => {
		try {
			const response = await getProductCategories()

			if (!response.success) {
				return rejectWithValue(response.message)
			}

			return response.productCategory
		} catch (error) {
			if (error instanceof Error) {
				return rejectWithValue(error.message)
			}
		}
	}
)

export default getCategoriesAction
