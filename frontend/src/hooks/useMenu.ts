import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	getMenus,
	getMenuById,
	createMenu,
	updateMenu,
	deleteMenu,
} from '@/api/menuApi'
import { CreateMenuInput } from '@/types'
import { toast } from '@/components/ui/use-toast'

export const useMenu = () => {
	const queryClient = useQueryClient()

	const getMenusQuery = useQuery({
		queryKey: ['menus'],
		queryFn: getMenus,
	})

	const createMenuMutation = useMutation({
		mutationFn: createMenu,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menus'] })
			toast({
				title: 'Menu created successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to create menu',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const updateMenuMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: CreateMenuInput }) =>
			updateMenu(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menus'] })
			toast({
				title: 'Menu updated successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to update menu',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const deleteMenuMutation = useMutation({
		mutationFn: deleteMenu,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['menus'] })
			toast({
				title: 'Menu deleted successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to delete menu',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	return {
		menus: getMenusQuery.data,
		isLoading: getMenusQuery.isLoading,
		isError: getMenusQuery.isError,
		error: getMenusQuery.error,
		createMenu: createMenuMutation.mutate,
		updateMenu: updateMenuMutation.mutate,
		deleteMenu: deleteMenuMutation.mutate,
		useMenuById: (id: string) =>
			useQuery({
				queryKey: ['menu', id],
				queryFn: () => getMenuById(id),
			}),
	}
}
