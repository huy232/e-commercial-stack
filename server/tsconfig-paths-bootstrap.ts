import * as tsconfigPaths from "tsconfig-paths"
import * as dotenv from "dotenv"

const result = dotenv.config()

if (result.error) {
	console.error("Error loading .env file:", result.error)
	process.exit(1)
}

const tsConfigPathsResult = tsconfigPaths.loadConfig()
if (tsConfigPathsResult.resultType === "success") {
	tsconfigPaths.register({
		baseUrl: tsConfigPathsResult.absoluteBaseUrl,
		paths: tsConfigPathsResult.paths,
	})
} else {
	console.error("Error loading tsconfig.json:", tsConfigPathsResult.message)
	process.exit(1)
}
