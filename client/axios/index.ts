import { getAccessToken } from "@/utils"
import axios from "axios"

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URI,
	withCredentials: true,
})

// Add a request interceptor
instance.interceptors.request.use(
	function (config) {
		const accessToken = getAccessToken()
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}
		return config
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error)
	}
)

// Add a response interceptor
instance.interceptors.response.use(
	function (response) {
		// Any status code that lies within the range of 2xx causes this function to trigger
		// Do something with response data
		return response
	},
	function (error) {
		// Any status codes that fall outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error)
	}
)

export default instance
