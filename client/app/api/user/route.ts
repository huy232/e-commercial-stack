import axios from "axios"

export interface UserRegister {
	firstName: string
	lastName: string
	email: string
	password: string
}

export interface UserLogin {
	email: string
	password: string
}

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URI,
})

export const userRegister = (params: UserRegister) =>
	api({
		url: "/user/register",
		method: "post",
		params,
	})

export const userLogin = (params: UserLogin) =>
	api({
		url: "/user/login",
		method: "post",
		params,
	})
