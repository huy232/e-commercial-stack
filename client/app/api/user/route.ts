import axios from "@/axios"

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
	axios({
		url: "/user/register",
		method: "post",
		data,
	})

export const userLogin = (data: UserLogin) =>
	axios({
		url: "/user/login",
		method: "post",
		data,
	})
