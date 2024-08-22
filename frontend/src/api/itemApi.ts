import axios from 'axios'
import { Item, CreateItemInput } from '@/types'

const itemApi = axios.create({
	baseURL: 'http://localhost:5000/api/menus',
	withCredentials: true,
})

export const getItemsByCategoryId = async (
	menuId: string,
	categoryId: string
): Promise<Item[]> => {
	const response = await itemApi.get(
		`/${menuId}/categories/${categoryId}/items`
	)
	return response.data
}

export const createItem = async (
	menuId: string,
	data: CreateItemInput
): Promise<Item> => {
	const response = await itemApi.post(
		`/${menuId}/categories/${data.categoryId}/items`,
		data
	)
	return response.data
}

export const updateItem = async (
	menuId: string,
	categoryId: string,
	itemId: string,
	data: Partial<CreateItemInput>
): Promise<Item> => {
	const response = await itemApi.put(
		`/${menuId}/categories/${categoryId}/items/${itemId}`,
		data
	)
	return response.data
}
export const deleteItem = async (
	menuId: string,
	categoryId: string,
	itemId: string
): Promise<void> => {
	try {
		const response = await itemApi.delete(
			`/${menuId}/categories/${categoryId}/items/${itemId}`
		)
		if (response.status === 200) {
			return // Successful deletion
		}
		throw new Error('Unexpected response from server')
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			console.error(error.response)
			if (error.response.status === 404) {
				return
			}
			throw new Error(error.response.data.message || 'Failed to delete item')
		}
		throw error
	}
}

export default itemApi
