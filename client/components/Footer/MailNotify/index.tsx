import { MdEmail } from "@/assets/icons"

const MailNotify = () => {
	return (
		<div className="w-full flex justify-center items-center bg-main">
			<div className="w-full flex-col gap-2 lg:flex-row lg:w-main flex justify-between items-center my-2">
				<div className="flex flex-1 flex-col items-center lg:items-start">
					<span className="text-md font-semibold text-gray-100">
						SIGN UP TO NEWSLETTER
					</span>
					<small className="text-xs text-gray-300 text-center lg:text-left">
						Subscribe now and receive weekly newsletter
					</small>
				</div>
				<div className="flex flex-1 items-center">
					<input
						className="p-4 pr-1 rounded-l-full w-full h-[40px] bg-white/30 outline-none text-gray-100 placeholder:text-gray-200 placeholder:text-sm placeholder:italic"
						type="text"
						id="mail"
						placeholder="Email address"
					/>
					<div className="rounded-r-full px-2 flex items-center justify-center text-white bg-white/30 h-[40px]">
						<MdEmail size={18} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default MailNotify
