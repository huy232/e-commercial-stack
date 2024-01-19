"use client"
import { ReactNode } from "react"
import { Provider } from "react-redux"
import { persistor, store } from "@/store"
import { PersistGate } from "redux-persist/integration/react"

interface ReduxProviderProps {
	children: ReactNode
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				{children}
			</PersistGate>
		</Provider>
	)
}

export default ReduxProvider
