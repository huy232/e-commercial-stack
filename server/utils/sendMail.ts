import nodemailer from "nodemailer"

interface MailParams {
	email: string
	html: string
	subject: string
}

const sendMail = async ({ email, html, subject }: MailParams) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_APP_NAME,
				pass: process.env.EMAIL_APP_PASSWORD,
			},
		})

		const info = await transporter.sendMail({
			from: '"E-commercial Takama" <no-reply@takama.com>', // sender address
			to: email, // list of receivers
			subject: subject, // Subject line
			html: html, // html body
		})

		return info
	} catch (error: any) {
		// Explicitly typing error as 'any'
		return { error: error.message }
	}
}

export { sendMail }
