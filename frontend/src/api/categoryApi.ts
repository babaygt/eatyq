import axios from 'axios'
import { Category, CreateCategoryInput } from '@/types'

const categoryApi = axios.create({
	baseURL: 'http://localhost:5000/api/menus',
	withCredentials: true,
})

export const getCategoriesByMenuId = async (
	menuId: string
): Promise<Category[]> => {
	const response = await categoryApi.get(`/${menuId}/categories`)
	return response.data
}

export const createCategory = async (
	data: CreateCategoryInput
): Promise<Category> => {
	const response = await categoryApi.post(`/${data.menuId}/categories`, {
		name: data.name,
	})
	return response.data
}

export const updateCategory = async (
	menuId: string,
	categoryId: string,
	data: { name: string }
): Promise<Category> => {
	const response = await categoryApi.put(
		`/${menuId}/categories/${categoryId}`,
		data
	)
	return response.data
}

export const deleteCategory = async (
	menuId: string,
	categoryId: string
): Promise<void> => {
	await categoryApi.delete(`/${menuId}/categories/${categoryId}`)
}

export default categoryApi
