import { MdEmail } from "@/assets/icons"

const MailNotify = () => {
	return (
		<div className="w-full flex justify-center items-center bg-main h-[105px]">
			<div className="w-main flex justify-between items-center">
				<div className="flex flex-col flex-1">
					<span className="text-md font-semibold text-gray-100">
						SIGN UP TO NEWSLETTER
					</span>
					<small className="text-xs text-gray-300">
						Subscribe now and receive weekly newsletter
					</small>
				</div>
				<div className="flex-1 flex items-center">
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
