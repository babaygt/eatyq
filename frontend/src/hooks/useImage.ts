import { useMutation } from '@tanstack/react-query'
import {
	uploadImage as uploadImageApi,
	deleteImage as deleteImageApi,
} from '@/api/imageApi'
import { toast } from '@/components/ui/use-toast'

export const useImage = () => {
	const uploadImageMutation = useMutation({
		mutationFn: uploadImageApi,
		onError: (error: Error) => {
			console.error('Image upload failed:', error)
			toast({
				title: 'Failed to upload image',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const deleteImageMutation = useMutation({
		mutationFn: deleteImageApi,
		onError: (error: Error) => {
			console.error('Image deletion failed:', error)
			toast({
				title: 'Failed to delete image',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	return {
		uploadImage: uploadImageMutation.mutateAsync,
		deleteImage: deleteImageMutation.mutateAsync,
		isUploading: uploadImageMutation.isPending,
		isDeleting: deleteImageMutation.isPending,
	}
}
