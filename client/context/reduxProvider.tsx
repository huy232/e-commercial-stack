"use client"
import { ReactNode, useEffect } from "react"
import { Provider } from "react-redux"
import { store } from "@/store"
import { persistStore } from "redux-persist"

interface ReduxProviderProps {
	children: ReactNode
}

let persistor: any

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
	useEffect(() => {
		if (typeof window !== "undefined") {
			persistor = persistStore(store)
		}
	}, [])

	return <Provider store={store}>{children}</Provider>
}

export default ReduxProvider
