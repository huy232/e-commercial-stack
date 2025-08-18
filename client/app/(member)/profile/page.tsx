import { ProfileInformation } from "@/components"
import { Metadata } from "next"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "My Profile | Digital World",
	description:
		"Access and manage your Digital World profile. Update personal information, change account settings, and keep your details secure.",
	keywords: [
		"user profile",
		"account settings",
		"personal information",
		"Digital World account",
		"profile management",
	],
}

const Profile = (props: Props) => {
	return <ProfileInformation />
}
export default Profile
