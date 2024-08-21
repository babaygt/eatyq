import axios from 'axios'

const imageApi = axios.create({
	baseURL: 'http://localhost:5000/api/image',
	withCredentials: true,
})

export const uploadImage = async (
	file: File
): Promise<{ url: string; public_id: string }> => {
	const formData = new FormData()
	formData.append('image', file)

	const response = await imageApi.post('/image', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})

	return response.data
}

export const deleteImage = async (public_id: string): Promise<void> => {
	await imageApi.delete(`/image/${public_id}`)
}

export default imageApi
