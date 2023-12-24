import { FooterContent, MailNotify } from "@/app/components"
import { memo } from "react"

const Footer = memo(() => {
	return (
		<div className="w-full">
			<MailNotify />
			<FooterContent />
		</div>
	)
})

Footer.displayName = "Footer"

export default Footer
