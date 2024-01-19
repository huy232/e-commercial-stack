import { configureStore } from "@reduxjs/toolkit"
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import authReducer, { AuthState } from "@/store/slices/authSlice"
import { Persistor } from "redux-persist/es/types"
import { Store } from "redux"

const persistConfig = {
	key: "root",
	storage,
}

const persistedAuthReducer = persistReducer<AuthState, any>(
	persistConfig,
	authReducer
)

const store: Store<{ auth: AuthState }, any> = configureStore({
	reducer: {
		auth: persistedAuthReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
})

const persistor: Persistor = persistStore(store)

export { store, persistor }

export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
