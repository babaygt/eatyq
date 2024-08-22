import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
	getItemsByCategoryId,
	createItem,
	updateItem as updateItemApi,
	deleteItem as deleteItemApi,
} from '@/api/itemApi'
import { Item, CreateItemInput } from '@/types'
import { toast } from '@/components/ui/use-toast'

export const useItem = (menuId: string, categoryId: string) => {
	const queryClient = useQueryClient()

	const invalidateRelatedQueries = () => {
		queryClient.invalidateQueries({ queryKey: ['items', menuId, categoryId] })
		queryClient.invalidateQueries({ queryKey: ['categories', menuId] })
		queryClient.invalidateQueries({ queryKey: ['menu', menuId] })
	}

	const getItems = useQuery({
		queryKey: ['items', menuId, categoryId],
		queryFn: () => getItemsByCategoryId(menuId, categoryId),
		enabled: !!categoryId,
	})

	const createItemMutation = useMutation({
		mutationFn: (data: CreateItemInput) => createItem(menuId, data),
		onSuccess: () => {
			invalidateRelatedQueries()
			toast({
				title: 'Item created successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to create item',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const updateItemMutation = useMutation({
		mutationFn: ({ itemId, data }: { itemId: string; data: Partial<Item> }) =>
			updateItemApi(menuId, categoryId, itemId, data),
		onSuccess: () => {
			invalidateRelatedQueries()
			toast({
				title: 'Item updated successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to update item',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const deleteItemMutation = useMutation({
		mutationFn: (itemId: string) => deleteItemApi(menuId, categoryId, itemId),
		onMutate: async (itemId) => {
			// Cancel any outgoing refetches
			await queryClient.cancelQueries({
				queryKey: ['items', menuId, categoryId],
			})

			// Snapshot the previous value
			const previousItems = queryClient.getQueryData<Item[]>([
				'items',
				menuId,
				categoryId,
			])

			// Optimistically update to the new value
			queryClient.setQueryData<Item[]>(['items', menuId, categoryId], (old) =>
				old ? old.filter((item) => item._id !== itemId) : []
			)

			// Return a context object with the snapshotted value
			return { previousItems }
		},
		onError: (err, itemId, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			queryClient.setQueryData(
				['items', menuId, categoryId],
				context?.previousItems
			)
			toast({
				title: 'Failed to delete item',
				description:
					err instanceof Error ? err.message : 'An unknown error occurred',
				variant: 'destructive',
			})
		},
		onSettled: () => {
			// Always refetch after error or success
			invalidateRelatedQueries()
		},
		onSuccess: () => {
			toast({
				title: 'Item deleted successfully',
				variant: 'success',
			})
		},
	})

	return {
		items: getItems.data,
		isLoading: getItems.isLoading,
		isError: getItems.isError,
		error: getItems.error,
		createItem: createItemMutation.mutate,
		updateItem: updateItemMutation.mutate,
		deleteItem: deleteItemMutation.mutate,
	}
}
