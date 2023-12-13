import { ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "./reduxTypes"

export interface RootState {
	app: {
		categories: CategoryType[] // Adjust the type based on your actual structure
		// Add other properties as needed
	}
	// Add other slices as needed
}

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	unknown
>
