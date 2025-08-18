export const adminDashboardStatus = {
	SINGLE: "SINGLE",
	PARENT: "PARENT",
} as const

export type AdminDashboardStatus = keyof typeof adminDashboardStatus
