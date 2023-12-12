import { Banner, Sidebar } from "@/components"

export default function Home() {
	return (
		<main className="w-main flex">
			<div className="w-[30%] flex flex-col gap-5 flex-auto border">
				<Sidebar />
				<span>Daily deal</span>
			</div>
			<div className="w-[70%] flex flex-col gap-5 flex-auto pl-5 border">
				<Banner />
				<span>Best seller</span>
			</div>
		</main>
	)
}
