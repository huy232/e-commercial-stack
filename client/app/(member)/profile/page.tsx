"use client"
import { ProfileInformation } from "@/components"
import { useMounted } from "@/hooks"
import { selectAuthUser } from "@/store/slices/authSlice"
import { ProfileUser } from "@/types"
import { path } from "@/utils"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}
const Profile = (props: Props) => {
	const router = useRouter()
	const mounted = useMounted()
	const user: ProfileUser = useSelector(selectAuthUser)
	if (!user) {
		router.push(`${process.env.NEXT_PUBLIC_CLIENT_URL}${path.LOGIN}`)
	}
	if (!mounted || !user) {
		return null
	}
	return <ProfileInformation user={user} />
}
export default Profile
