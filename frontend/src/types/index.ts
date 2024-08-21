export interface User {
	_id: string
	username: string
	email: string
}

export interface Menu {
	_id: string
	user: string | User
	name: string
	categories?: string[] | Category[]
	createdAt: string
	updatedAt: string
}

export interface Category {
	_id: string
	menu: string | Menu
	name: string
	items?: string[] | Item[]
	createdAt: string
	updatedAt: string
}

export interface Item {
	_id: string
	category: string | Category
	name: string
	description?: string
	price: number
	imageUrl?: string | null
	public_id?: string
	variations?: {
		name: string
		price?: number
	}[]
	createdAt: string
	updatedAt: string
}

export interface CreateMenuInput {
	name: string
}

export interface CreateCategoryInput {
	menuId: string
	name: string
}

export interface CreateItemInput {
	categoryId: string
	name: string
	description?: string
	price: number
	imageUrl?: string | null
	variations?: {
		name: string
		price?: number
	}[]
}
