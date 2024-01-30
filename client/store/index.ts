import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import { persistReducer } from "redux-persist"
// import storage from "redux-persist/lib/storage"
import authReducer from "@/store/slices/authSlice"
import storage from "./storage"

const persistConfig = {
	key: "root",
	storage: storage,
}

// const persistedAuthReducer = persistReducer<AuthState, any>(
// 	persistConfig,
// 	authReducer
// )

const rootReducer = combineReducers({
	auth: persistReducer(persistConfig, authReducer),
})

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
