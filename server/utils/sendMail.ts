import nodemailer from "nodemailer"

interface MailParams {
	email: string
	html: string
	subject: string
}

const sendMail = async ({ email, html, subject }: MailParams) => {
	try {
		if (!process.env.EMAIL_APP_NAME || !process.env.EMAIL_APP_PASSWORD) {
			throw new Error(
				"Email credentials are missing. Make sure EMAIL_APP_NAME and EMAIL_APP_PASSWORD are set in environment."
			)
		}

		// Create SMTP transporter
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true, // Use SSL
			auth: {
				user: process.env.EMAIL_APP_NAME,
				pass: process.env.EMAIL_APP_PASSWORD,
			},
		})

		await transporter.verify()

		const info = await transporter.sendMail({
			from: `"Digital World Commercial" <${process.env.EMAIL_APP_NAME}>`,
			to: email,
			subject: subject,
			html: html,
		})

		console.log(`[Email sent] Message ID: ${info.messageId} to ${email}`)
		return { success: true, messageId: info.messageId }
	} catch (error: any) {
		console.error(`[Email failed] ${error.message}`)

		let errorMessage = error.message

		if (
			errorMessage.includes("Invalid login") ||
			errorMessage.includes("535") ||
			errorMessage.includes("Authentication failed")
		) {
			errorMessage =
				"Email authentication failed. Check EMAIL_APP_NAME and EMAIL_APP_PASSWORD. Use App Password if 2FA is enabled."
		} else if (errorMessage.includes("connect")) {
			errorMessage =
				"Cannot connect to SMTP server. Check network, port, and host settings."
		}

		return { success: false, error: errorMessage }
	}
}

export { sendMail }
