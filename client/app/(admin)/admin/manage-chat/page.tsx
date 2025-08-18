import { AdminChatRoomList } from "@/components"

export const metadata = {
	title: "Manage Chat Room | Digital World Admin",
	description:
		"Monitor and manage live chat rooms between customers and support staff.",
	robots: { index: false, follow: false },
}

export default async function AdminManageChat() {
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Manage chat room
			</h1>
			<AdminChatRoomList />
		</main>
	)
}
