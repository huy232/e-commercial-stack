import {
	AdminSidebarOption,
	AdminSidebarOptionParent,
	AdminSidebarOptionSingle,
	AdminSidebarSubOption,
} from "@/types"

export type RawSidebarOption =
	| Omit<AdminSidebarOptionSingle, "id">
	| {
			type: "PARENT"
			text: string
			path: null
			icon: JSX.Element
			subMenu: Omit<AdminSidebarSubOption, "id">[]
	  }

let idCounter = 1

export function generateAdminSidebar(
	options: RawSidebarOption[]
): AdminSidebarOption[] {
	return options.map((option) => {
		const id = idCounter++

		if (option.type === "PARENT") {
			const updatedSubMenu = option.subMenu.map((sub) => ({
				...sub,
				id: idCounter++,
			}))
			return { ...option, id, subMenu: updatedSubMenu }
		}

		return { ...option, id }
	})
}
