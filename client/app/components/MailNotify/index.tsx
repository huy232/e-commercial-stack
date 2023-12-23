const MailNotify = () => {
	return (
		<div className="w-full flex justify-center items-center bg-main">
			<div className="w-main flex justify-between items-center py-4">
				<div className="flex flex-col flex-1">
					<span className="text-md font-semibold text-gray-100">
						SIGN UP TO NEWSLETTER
					</span>
					<p className="text-xs text-gray-300">
						Subscribe now and receive weekly newsletter
					</p>
				</div>
				<input
					className="p-2 rounded-l-full rounded-r-full flex-1 w-full outline-none text-gray-100 placeholder:text-gray-200 placeholder:text-sm placeholder:italic bg-white/30"
					type="text"
					id="mail"
					placeholder="Email address"
				/>
			</div>
		</div>
	)
}
export default MailNotify
