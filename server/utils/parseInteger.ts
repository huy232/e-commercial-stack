function parseInteger(value: any, defaultValue: number): number {
	const parsedValue = parseInt(value, 10)
	return isNaN(parsedValue) ? defaultValue : parsedValue
}

export { parseInteger }
