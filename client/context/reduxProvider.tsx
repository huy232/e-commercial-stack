"use client"
import { ReactNode } from "react"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist"
import { store } from "@/store"

interface ReduxProviderProps {
	children: ReactNode
}

persistStore(store)
const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
	return <Provider store={store}>{children}</Provider>
}

export default ReduxProvider
