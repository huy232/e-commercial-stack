import { instance } from "@/axios"

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

export const userRegister = (data: UserRegister) =>
	instance({
		url: "/user/register",
		method: "post",
		data,
	})

export const userLogin = (data: UserLogin) =>
	instance({
		url: "/user/login",
		method: "post",
		data,
	})
