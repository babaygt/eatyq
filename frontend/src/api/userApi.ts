import axios from 'axios'

const userApi = axios.create({
	baseURL: 'http://localhost:5000/api/users',
	withCredentials: true,
})

type registerUserType = {
	username: string
	email: string
	password: string
}

export const registerUser = async (user: registerUserType) => {
	const response = await userApi.post('/register', user)
	return response.data
}

type User = {
	email: string
	password: string
}

export const loginUser = async (user: User) => {
	const response = await userApi.post('/login', user)
	return response.data
}

export const logoutUser = async () => {
	const response = await userApi.post('/logout')
	return response.data
}

export default userApi
