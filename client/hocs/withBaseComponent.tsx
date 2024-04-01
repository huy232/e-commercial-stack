import { AppDispatch } from "@/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { ComponentType, FC, ReactElement } from "react"

// Define the HOC
const withBaseComponent = <P extends object>(
	WrappedComponent: ComponentType<P>
): FC<P> => {
	const WithBase: FC<P> = (props) => {
		const dispatch = useDispatch<AppDispatch>()
		const pathname = usePathname()
		const searchParams = useSearchParams()
		const { replace } = useRouter()
		const router = useRouter()

		return (
			<WrappedComponent
				{...(props as P)}
				dispatch={dispatch}
				pathname={pathname}
				searchParams={searchParams}
				replace={replace}
				router={router}
			/>
		)
	}

	WithBase.displayName = `withBaseComponent(${
		WrappedComponent.displayName || WrappedComponent.name || "Component"
	})`

	return WithBase
}

export default withBaseComponent
