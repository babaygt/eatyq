import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMenuById, deleteMenu } from '@/api/menuApi'
import { getCategoriesByMenuId, deleteCategory } from '@/api/categoryApi'
import { getItemsByCategoryId, updateItem, deleteItem } from '@/api/itemApi'
import { Button } from '@/components/ui/button'
import { CategoryTab } from '@/components/CategoryTab'
import { CreateCategoryModal } from '@/components/CreateCategoryModal'
import { CreateItemModal } from '@/components/CreateItemModal'
import { ItemCard } from '@/components/ItemCard'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import { toast } from '@/components/ui/use-toast'
import { Item } from '@/types'
import { FaUtensils, FaPlus, FaTrash } from 'react-icons/fa'

const MenuPage = () => {
	const { menuId } = useParams<{ menuId: string }>()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
		useState(false)
	const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false)
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	)
	const [isDeleteMenuDialogOpen, setIsDeleteMenuDialogOpen] = useState(false)
	const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

	const { data: menu, isLoading: isMenuLoading } = useQuery({
		queryKey: ['menu', menuId],
		queryFn: () => getMenuById(menuId!),
	})

	const { data: categories, isLoading: areCategoriesLoading } = useQuery({
		queryKey: ['categories', menuId],
		queryFn: () => getCategoriesByMenuId(menuId!),
	})

	const { data: items, isLoading: areItemsLoading } = useQuery({
		queryKey: ['items', menuId, selectedCategoryId],
		queryFn: () =>
			selectedCategoryId
				? getItemsByCategoryId(menuId!, selectedCategoryId)
				: Promise.resolve([]),
		enabled: !!selectedCategoryId,
	})

	const updateItemMutation = useMutation({
		mutationFn: ({ itemId, data }: { itemId: string; data: Partial<Item> }) =>
			updateItem(menuId!, selectedCategoryId!, itemId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['items', menuId, selectedCategoryId],
			})
		},
	})

	const deleteItemMutation = useMutation({
		mutationFn: (itemId: string) =>
			deleteItem(menuId!, selectedCategoryId!, itemId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['items', menuId, selectedCategoryId],
			})
		},
	})

	const deleteMenuMutation = useMutation({
		mutationFn: () => deleteMenu(menuId!),
		onSuccess: () => {
			navigate('/dashboard')
			toast({
				title: 'Menu deleted successfully',
				description: 'The menu and all its items have been removed.',
				variant: 'success',
			})
			queryClient.invalidateQueries({ queryKey: ['menus'] })
		},
		onError: (error) => {
			toast({
				title: 'Failed to delete menu',
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
				variant: 'destructive',
			})
		},
	})

	const deleteCategoryMutation = useMutation({
		mutationFn: (categoryId: string) => deleteCategory(menuId!, categoryId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories', menuId] })
			toast({
				title: 'Category deleted successfully',
				variant: 'success',
			})
			setSelectedCategoryId(null)
		},
		onError: (error) => {
			toast({
				title: 'Failed to delete category',
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
				variant: 'destructive',
			})
		},
	})

	if (isMenuLoading || areCategoriesLoading)
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500'></div>
			</div>
		)

	return (
		<div className='container mx-auto p-4 max-w-7xl'>
			<header className='bg-green-100 rounded-lg p-6 mb-8 shadow-md'>
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-bold text-green-800 flex items-center'>
						<FaUtensils className='mr-2' />
						{menu?.name}
					</h1>
					<Button
						variant='destructive'
						onClick={() => setIsDeleteMenuDialogOpen(true)}
						className='flex items-center'
					>
						<FaTrash className='mr-2' />
						Delete Menu
					</Button>
				</div>
			</header>

			<section className='mb-8 container'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-2xl font-semibold text-gray-700'>Categories</h2>
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
						/>
					))}
				</div>
			</section>

			{selectedCategoryId && (
				<section className='bg-gray-50 rounded-lg p-6 shadow-md'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-2xl font-semibold text-gray-700'>Items</h2>
						<Button
							onClick={() => setIsCreateItemModalOpen(true)}
							className='bg-green-600 hover:bg-green-700'
						>
							<FaPlus className='mr-2' />
							Add Item
						</Button>
					</div>
					{areItemsLoading ? (
						<div className='flex justify-center items-center h-32'>
							<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
							{items?.map((item) => (
								<ItemCard
									key={item._id}
									item={item}
									menuId={menuId!}
									categoryId={selectedCategoryId}
									onDelete={(itemId) => deleteItemMutation.mutate(itemId)}
									onUpdate={(itemId, updatedItem) =>
										updateItemMutation.mutate({ itemId, data: updatedItem })
									}
								/>
							))}
						</div>
					)}
				</section>
			)}

			<CreateCategoryModal
				isOpen={isCreateCategoryModalOpen}
				onClose={() => setIsCreateCategoryModalOpen(false)}
				menuId={menuId!}
				onCategoryCreated={() => {
					queryClient.invalidateQueries({ queryKey: ['categories', menuId] })
				}}
			/>

			<CreateItemModal
				isOpen={isCreateItemModalOpen}
				onClose={() => setIsCreateItemModalOpen(false)}
				categoryId={selectedCategoryId!}
				menuId={menuId!}
				onItemCreated={() => {
					queryClient.invalidateQueries({
						queryKey: ['items', menuId, selectedCategoryId],
					})
				}}
			/>

			<ConfirmationDialog
				isOpen={isDeleteMenuDialogOpen}
				onClose={() => setIsDeleteMenuDialogOpen(false)}
				onConfirm={() => deleteMenuMutation.mutate()}
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
						deleteCategoryMutation.mutate(deleteCategoryId)
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