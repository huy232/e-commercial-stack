import { createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories } from "@/app/api/home/route"
import { AppThunk } from "@/types/redux"

export const getCategoriesAction = createAsyncThunk(
	"app/categories",
	async (_, { rejectWithValue }) => {
		try {
			const response = await getCategories()

			if (!response.success) {
				return rejectWithValue(response)
			}

			return response
		} catch (error) {
			if (error instanceof Error) {
				return rejectWithValue(error.message)
			}
		}
	}
)

export default getCategoriesAction
