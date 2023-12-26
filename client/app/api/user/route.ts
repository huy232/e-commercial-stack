import axios from "axios"

interface UserRegister {
	name: string
	email: string
	password: string
}

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URI,
})

export const getProducts = (params: UserRegister) =>
	api({
		url: "/user/register",
		method: "post",
		params,
	})
