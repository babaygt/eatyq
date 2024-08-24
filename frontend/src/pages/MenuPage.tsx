import React, { useState, useMemo } from 'react'
import { useParams, useNavigate, generatePath } from 'react-router-dom'
import { useMenu } from '@/hooks/useMenu'
import { useCategory } from '@/hooks/useCategory'
import { useItem } from '@/hooks/useItem'
import { Button } from '@/components/ui/button'
import { CategoryTab } from '@/components/CategoryTab'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'
import { CreateItemModal } from '@/components/CreateItemModal'
import { ItemCard } from '@/components/ItemCard'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import QRCodeComponent from '@/components/QRCodeComponent'
import { SearchBar } from '@/components/SearchBar'
import { FaUtensils, FaPlus, FaTrash, FaQrcode } from 'react-icons/fa'
import { Item } from '@/types'

const MenuPage: React.FC = () => {
	const { menuId } = useParams<{ menuId: string }>()
	const navigate = useNavigate()
	const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
		useState(false)
	const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false)
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	)
	const [isDeleteMenuDialogOpen, setIsDeleteMenuDialogOpen] = useState(false)
	const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
	const [isQRCodeVisible, setIsQRCodeVisible] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const { useMenuById, deleteMenu } = useMenu()
	const { categories, deleteCategory } = useCategory(menuId!)
	const { items, updateItem, deleteItem } = useItem(
		menuId!,
		selectedCategoryId!
	)

	console.log(items)

	const filteredItems = useMemo(() => {
		return (
			items?.filter(
				(item) =>
					item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.description?.toLowerCase().includes(searchTerm.toLowerCase())
			) || []
		)
	}, [items, searchTerm])

	const { data: menu, isLoading: isMenuLoading } = useMenuById(menuId!)

	if (isMenuLoading || !menu) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500'></div>
			</div>
		)
	}

	const handleDeleteMenu = () => {
		deleteMenu(menuId!, {
			onSuccess: () => {
				navigate('/dashboard')
			},
		})
	}

	const handleDeleteCategory = (categoryId: string) => {
		deleteCategory(categoryId, {
			onSuccess: () => {
				setSelectedCategoryId(null)
			},
		})
	}

	const publicMenuPath = generatePath('/menu/:menuId/public', {
		menuId: menuId ?? '',
	})
	const publicMenuUrl = `${window.location.origin}${publicMenuPath}`

	return (
		<div className='container mx-auto p-4 max-w-7xl'>
			<header className='bg-green-100 rounded-lg p-6 mb-8 shadow-md'>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-bold text-green-800 flex items-center'>
						<FaUtensils className='mr-2' />
						{menu.name}
					</h1>
					<div className='flex space-x-2'>
						<Button
							onClick={() => setIsQRCodeVisible(!isQRCodeVisible)}
							className='bg-blue-500 hover:bg-blue-600'
						>
							<FaQrcode className='mr-2' />
							{isQRCodeVisible ? 'Hide QR Code' : 'Show QR Code'}
						</Button>
						<Button
							variant='destructive'
							onClick={() => setIsDeleteMenuDialogOpen(true)}
							className='flex items-center'
						>
							<FaTrash className='mr-2' />
							Delete Menu
						</Button>
					</div>
				</div>
			</header>

			{isQRCodeVisible && (
				<section className='mb-8 bg-white rounded-lg p-6 shadow-md'>
					<h2 className='text-2xl font-semibold text-gray-700 mb-4'>QR Code</h2>
					<QRCodeComponent url={publicMenuUrl} menuName={menu.name} />
				</section>
			)}
			<section className='mb-8 container'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-3xl font-bold text-gray-700'>Categories</h2>
					<Button
						onClick={() => setIsCreateCategoryModalOpen(true)}
						className='bg-green-600 hover:bg-green-700'
					>
						<FaPlus className='mr-2' />
						Add Category
					</Button>
				</div>
				<div className='flex flex-wrap gap-2'>
					{categories?.map((category) => (
						<CategoryTab
							key={category._id}
							category={category}
							isSelected={selectedCategoryId === category._id}
							onClick={() => setSelectedCategoryId(category._id)}
							onDeleteClick={() => setDeleteCategoryId(category._id)}
							showDeleteButton={true}
						/>
					))}
				</div>
			</section>

			{selectedCategoryId && (
				<section className='bg-gray-50 rounded-lg p-6 shadow-md'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-2xl font-semibold text-gray-700'>Items</h2>
						<div className='w-1/2 '>
							<SearchBar onSearch={setSearchTerm} />
						</div>
						<Button
							onClick={() => setIsCreateItemModalOpen(true)}
							className='bg-green-600 hover:bg-green-700'
						>
							<FaPlus className='mr-2' />
							Add Item
						</Button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
						{filteredItems.map((item) => (
							<ItemCard
								key={item._id}
								item={item}
								menuId={menuId!}
								categoryId={selectedCategoryId}
								onDelete={() => deleteItem(item._id)}
								onUpdate={(updatedItem: Partial<Item>) =>
									updateItem({ itemId: item._id, data: updatedItem })
								}
							/>
						))}
					</div>
				</section>
			)}

			<CreateCategoryModal
				isOpen={isCreateCategoryModalOpen}
				onClose={() => setIsCreateCategoryModalOpen(false)}
				menuId={menuId!}
			/>

			<CreateItemModal
				isOpen={isCreateItemModalOpen}
				onClose={() => setIsCreateItemModalOpen(false)}
				categoryId={selectedCategoryId!}
				menuId={menuId!}
			/>

			<ConfirmationDialog
				isOpen={isDeleteMenuDialogOpen}
				onClose={() => setIsDeleteMenuDialogOpen(false)}
				onConfirm={handleDeleteMenu}
				title='Delete Menu'
				description='Are you sure you want to delete this menu? This action cannot be undone and will delete all associated categories and items.'
				confirmText='Delete'
				cancelText='Cancel'
			/>

			<ConfirmationDialog
				isOpen={!!deleteCategoryId}
				onClose={() => setDeleteCategoryId(null)}
				onConfirm={() => {
					if (deleteCategoryId) {
						handleDeleteCategory(deleteCategoryId)
						setDeleteCategoryId(null)
					}
				}}
				title='Delete Category'
				description='Are you sure you want to delete this category? This action cannot be undone and will delete all associated items.'
				confirmText='Delete'
				cancelText='Cancel'
			/>
		</div>
	)
}

export default MenuPage
