import { ClipLoader, BounceLoader } from "react-spinners"

export const LoadingSpinner = () => {
	return (
		<div className="flex justify-center items-center h-40 w-full">
			<ClipLoader color="#3b82f6" size={50} />
			{/* <BounceLoader color="#3b82f6" size={60} /> */}
		</div>
	)
}
