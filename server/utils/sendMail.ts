// import nodemailer from "nodemailer"

// interface MailParams {
// 	email: string
// 	html: string
// 	subject: string
// }

// const sendMail = async ({ email, html, subject }: MailParams) => {
// 	if (!process.env.EMAIL_APP_NAME || !process.env.EMAIL_APP_PASSWORD) {
// 		throw new Error(
// 			"Email credentials are missing. Make sure EMAIL_APP_NAME and EMAIL_APP_PASSWORD are set in environment."
// 		)
// 	}

// 	// Create SMTP transporter
// 	const transporter = nodemailer.createTransport({
// 		host: "smtp.gmail.com",
// 		port: 465,
// 		secure: true,
// 		auth: {
// 			user: process.env.EMAIL_APP_NAME,
// 			pass: process.env.EMAIL_APP_PASSWORD, // must be App Password if 2FA enabled
// 		},
// 	})

// 	// Wrap sendMail in a promise to ensure completion
// 	return await new Promise<{
// 		success: boolean
// 		messageId?: string
// 		error?: string
// 	}>((resolve, reject) => {
// 		transporter.sendMail(
// 			{
// 				from: `"Digital World Commercial" <${process.env.EMAIL_APP_NAME}>`,
// 				to: email,
// 				subject,
// 				html,
// 			},
// 			(err, info) => {
// 				if (err) {
// 					console.error(`[Email failed] ${err.message}`)
// 					let errorMessage = err.message
// 					if (
// 						errorMessage.includes("Invalid login") ||
// 						errorMessage.includes("535") ||
// 						errorMessage.includes("Authentication failed")
// 					) {
// 						errorMessage =
// 							"Email authentication failed. Check EMAIL_APP_NAME and EMAIL_APP_PASSWORD. Use App Password if 2FA is enabled."
// 					} else if (errorMessage.includes("connect")) {
// 						errorMessage =
// 							"Cannot connect to SMTP server. Check network, port, and host settings."
// 					}
// 					resolve({ success: false, error: errorMessage })
// 				} else {
// 					console.log(`[Email sent] Message ID: ${info.messageId} to ${email}`)
// 					resolve({ success: true, messageId: info.messageId })
// 				}
// 			}
// 		)
// 	})
// }

// export { sendMail }

import axios from "axios"

const VERCEL_MAILER_URL = process.env.VERCEL_MAILER_URL as string

interface MailOptions {
	email: string
	subject: string
	html: string
}

export async function sendMail({ email, subject, html }: MailOptions) {
	try {
		const response = await axios.post(VERCEL_MAILER_URL, {
			to: email,
			subject,
			html,
		})

		if (response.data.error) {
			throw new Error(response.data.error)
		}

		return response.data
	} catch (err: any) {
		console.error("Failed to send email via Vercel:", err.message)
		throw err
	}
}
