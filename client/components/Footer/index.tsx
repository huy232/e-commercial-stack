import { FooterContent, MailNotify } from "@/components"
import { memo } from "react"

const Footer = memo(() => {
	return (
		<div className="w-full mt-auto">
			<MailNotify />
			<FooterContent />
		</div>
	)
})

Footer.displayName = "Footer"

export default Footer
