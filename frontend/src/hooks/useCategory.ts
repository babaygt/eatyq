import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	getCategoriesByMenuId,
	createCategory,
	updateCategory,
	deleteCategory,
} from '@/api/categoryApi'
import { toast } from '@/components/ui/use-toast'

export const useCategory = (menuId: string) => {
	const queryClient = useQueryClient()

	const getCategories = useQuery({
		queryKey: ['categories', menuId],
		queryFn: () => getCategoriesByMenuId(menuId),
	})

	const createCategoryMutation = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories', menuId] })
			toast({
				title: 'Category created successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to create category',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const updateCategoryMutation = useMutation({
		mutationFn: ({
			categoryId,
			data,
		}: {
			categoryId: string
			data: { name: string }
		}) => updateCategory(menuId, categoryId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories', menuId] })
			toast({
				title: 'Category updated successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to update category',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const deleteCategoryMutation = useMutation({
		mutationFn: (categoryId: string) => deleteCategory(menuId, categoryId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories', menuId] })
			toast({
				title: 'Category deleted successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to delete category',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	return {
		categories: getCategories.data,
		isLoading: getCategories.isLoading,
		isError: getCategories.isError,
		error: getCategories.error,
		createCategory: createCategoryMutation.mutate,
		updateCategory: updateCategoryMutation.mutate,
		deleteCategory: deleteCategoryMutation.mutate,
	}
}
