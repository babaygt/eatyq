import axios from 'axios'
import { Menu, CreateMenuInput } from '@/types'

const menuApi = axios.create({
	baseURL: 'http://localhost:5000/api/menus',
	withCredentials: true,
})

export const getMenus = async (): Promise<Menu[]> => {
	const response = await menuApi.get('/')
	return response.data
}

export const getMenuById = async (id: string): Promise<Menu> => {
	const response = await menuApi.get(`/${id}`)
	return response.data
}

export const createMenu = async (data: CreateMenuInput): Promise<Menu> => {
	const response = await menuApi.post('/', data)
	return response.data
}

export const updateMenu = async (
	id: string,
	data: CreateMenuInput
): Promise<Menu> => {
	const response = await menuApi.patch(`/${id}`, data)
	return response.data
}

export const deleteMenu = async (id: string): Promise<void> => {
	await menuApi.delete(`/${id}`)
}

export default menuApi
