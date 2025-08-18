import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import { persistReducer } from "redux-persist"
import authReducer from "@/store/slices/authSlice"
import storage from "./storage"
import { cartReducer, notifyReducer } from "./slices"

const persistConfig = {
	key: "root",
	storage: storage,
}

const rootReducer = combineReducers({
	auth: persistReducer(persistConfig, authReducer),
	cart: persistReducer(persistConfig, cartReducer),
	notify: persistReducer(persistConfig, notifyReducer),
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
