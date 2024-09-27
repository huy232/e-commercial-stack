type Params = {
	limit?: number
	page?: number
	[key: string]: string | number | undefined | string[]
}

export const queryProductString = async (params: Params) => {
	const queryParamsArray: Array<[string, string]> = []
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined) {
			if (Array.isArray(value)) {
				for (const item of value) {
					queryParamsArray.push([key, item.toString()])
				}
			} else {
				queryParamsArray.push([key, value.toString()])
			}
		}
	}
	const queryParams = new URLSearchParams(queryParamsArray).toString()
	return queryParams
}
