import { createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories } from "@/app/api/home/route"

export const getCategoriesAction = createAsyncThunk(
	"app/categories",
	async (data, { rejectWithValue }) => {
		try {
			const response = await getCategories()

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
