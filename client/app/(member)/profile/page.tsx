"use client"
import { ProfileInformation } from "@/components"
import { useMounted } from "@/hooks"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}
const Profile = (props: Props) => {
	const mounted = useMounted()
	if (!mounted) {
		return null
	}
	return <ProfileInformation />
}
export default Profile
