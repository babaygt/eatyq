import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Item } from '@/types'
import { updateItem } from '@/api/itemApi'
import { uploadImage, deleteImage } from '@/api/imageApi'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import { toast } from '@/components/ui/use-toast'
import { FaEdit, FaPlus, FaTrash, FaUpload } from 'react-icons/fa'

interface EditItemModalProps {
	isOpen: boolean
	onClose: () => void
	item: Item
	menuId: string
	categoryId: string
	onUpdate: (itemId: string, updatedItem: Partial<Item>) => void
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
	isOpen,
	onClose,
	item,
	menuId,
	categoryId,
	onUpdate,
}) => {
	const [name, setName] = useState(item.name)
	const [description, setDescription] = useState(item.description || '')
	const [price, setPrice] = useState(item.price.toString())
	const [imageUrl, setImageUrl] = useState(item.imageUrl || '')
	const [newImage, setNewImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [variations, setVariations] = useState(item.variations || [])
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
	const [isImageRemoved, setIsImageRemoved] = useState(false)

	const queryClient = useQueryClient()

	const uploadImageMutation = useMutation({
		mutationFn: uploadImage,
		onSuccess: (data) => {
			setImageUrl(data.url)
			toast({
				title: 'Image uploaded successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to upload image',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const deleteImageMutation = useMutation({
		mutationFn: (publicId: string) => deleteImage(publicId),
		onSuccess: () => {
			setImageUrl('')
			setIsImageRemoved(true)
			toast({
				title: 'Image deleted successfully',
				variant: 'success',
			})
		},
		onError: (error: Error) => {
			toast({
				title: 'Failed to delete image',
				description: error.message,
				variant: 'destructive',
			})
		},
	})

	const updateItemMutation = useMutation({
		mutationFn: (updatedItem: Partial<Item>) =>
			updateItem(menuId, categoryId, item._id, updatedItem),
		onSuccess: (updatedItem) => {
			queryClient.invalidateQueries({ queryKey: ['items', menuId, categoryId] })
			onUpdate(item._id, updatedItem)
			onClose()
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

	const confirmUpdate = async () => {
		let updatedImageUrl = isImageRemoved ? null : imageUrl

		if (newImage) {
			try {
				const uploadResult = await uploadImageMutation.mutateAsync(newImage)
				updatedImageUrl = uploadResult.url
			} catch (error) {
				toast({
					title: 'Failed to upload new image',
					description: (error as Error).message,
					variant: 'destructive',
				})
				return
			}
		}

		const updatedItem = {
			name,
			description,
			price: parseFloat(price),
			imageUrl: updatedImageUrl,
			variations: variations.length > 0 ? variations : undefined,
		}

		await updateItemMutation.mutateAsync(updatedItem)
		setIsConfirmDialogOpen(false)
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setNewImage(file)
			setIsImageRemoved(false)

			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleRemoveImage = async () => {
		if (imageUrl) {
			const publicId = getPublicIdFromUrl(imageUrl)
			try {
				await deleteImageMutation.mutateAsync(publicId)
			} catch (error) {
				toast({
					title: 'Failed to remove image from server',
					description: (error as Error).message,
					variant: 'destructive',
				})
			}
		}
		setImageUrl('')
		setNewImage(null)
		setPreviewUrl(null)
		setIsImageRemoved(true)
	}

	const getPublicIdFromUrl = (url: string) => {
		const parts = url.split('/')
		const filenameWithExtension = parts.pop() || ''
		return filenameWithExtension.split('.')[0]
	}

	const handleVariationChange = (
		index: number,
		field: 'name' | 'price',
		value: string
	) => {
		const updatedVariations = [...variations]
		if (field === 'name') {
			updatedVariations[index].name = value
		} else {
			updatedVariations[index].price = parseFloat(value) || undefined
		}
		setVariations(updatedVariations)
	}

	const addVariation = () => {
		setVariations([...variations, { name: '', price: undefined }])
	}

	const removeVariation = (index: number) => {
		const updatedVariations = variations.filter((_, i) => i !== index)
		setVariations(updatedVariations)
	}

	const handleSubmit = () => {
		setIsConfirmDialogOpen(true)
	}

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className='sm:max-w-[600px] max-h-[90vh] bg-white rounded-lg flex flex-col'>
					<DialogHeader className='flex-shrink-0'>
						<DialogTitle className='text-xl font-semibold text-green-700 flex items-center'>
							<FaEdit className='mr-2 text-green-700' />
							Edit Item
						</DialogTitle>
					</DialogHeader>
					<div className='flex-grow overflow-y-auto px-4 py-2'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label
									htmlFor='name'
									className='text-sm font-semibold  text-gray-700'
								>
									Name
								</Label>
								<Input
									id='name'
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder='Item Name'
									className='border-green-500 focus:ring-green-500 focus:border-green-500'
								/>
							</div>
							<div className='space-y-2'>
								<Label
									htmlFor='price'
									className='text-sm font-semibold  text-gray-700'
								>
									Price
								</Label>
								<Input
									id='price'
									type='number'
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder='Item Price'
									className='border-green-500 focus:ring-green-500 focus:border-green-500'
								/>
							</div>
							<div className='space-y-2 col-span-full'>
								<Label
									htmlFor='description'
									className='text-sm font-semibold  text-gray-700'
								>
									Description
								</Label>
								<Textarea
									id='description'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder='Item Description'
									className='border-green-500 focus:ring-green-500 focus:border-green-500'
								/>
							</div>
							<div className='space-y-2 col-span-full'>
								<Label
									htmlFor='image'
									className='text-sm font-semibold  text-gray-700'
								>
									Image
								</Label>
								{!isImageRemoved && (previewUrl || imageUrl) && (
									<img
										src={previewUrl || imageUrl}
										alt={name}
										className='w-full h-32 object-cover rounded mb-2 p-1 border border-green-600'
									/>
								)}
								<div className='flex items-center space-x-2'>
									<Input
										id='image'
										type='file'
										onChange={handleImageChange}
										accept='image/*'
										className='hidden'
									/>
									<Label
										htmlFor='image'
										className='cursor-pointer bg-green-500 text-white py-2 px-4 h-10 rounded hover:bg-green-600 transition duration-300 flex items-center'
									>
										<FaUpload className='mr-2' />
										{!isImageRemoved && (imageUrl || previewUrl)
											? 'Change Image'
											: 'Upload Image'}
									</Label>
									{!isImageRemoved && (imageUrl || previewUrl) && (
										<Button
											variant='destructive'
											onClick={handleRemoveImage}
											className='py-2 px-4'
										>
											Remove Image
										</Button>
									)}
								</div>
							</div>
							<div className='space-y-2 col-span-full'>
								<Label className='text-sm font-semibold text-gray-700 block'>
									Variations
								</Label>
								{variations.map((variation, index) => (
									<div key={index} className='flex gap-2 mb-2'>
										<Input
											value={variation.name}
											onChange={(e) =>
												handleVariationChange(index, 'name', e.target.value)
											}
											placeholder='Variation Name'
											className='border-green-500 focus:ring-green-500 focus:border-green-500'
										/>
										<Input
											type='number'
											value={variation.price?.toString() || ''}
											onChange={(e) =>
												handleVariationChange(index, 'price', e.target.value)
											}
											placeholder='Variation Price'
											className='border-green-500 focus:ring-green-500 focus:border-green-500'
										/>
										<Button
											onClick={() => removeVariation(index)}
											variant='destructive'
											className='px-2 py-0'
										>
											<FaTrash />
										</Button>
									</div>
								))}
								<Button
									onClick={addVariation}
									type='button'
									className='mt-2 bg-green-500 hover:bg-green-600'
								>
									<FaPlus className='mr-2' /> Add Variation
								</Button>
							</div>
						</div>
					</div>
					<DialogFooter className='flex-shrink-0 sm:justify-end mt-4'>
						<Button
							variant='outline'
							onClick={onClose}
							className='mr-2 border-gray-300 text-gray-700 hover:bg-gray-50'
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={
								updateItemMutation.isPending || uploadImageMutation.isPending
							}
							className='bg-green-500 hover:bg-green-600 text-white'
						>
							{updateItemMutation.isPending || uploadImageMutation.isPending
								? 'Updating...'
								: 'Update Item'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ConfirmationDialog
				isOpen={isConfirmDialogOpen}
				onClose={() => setIsConfirmDialogOpen(false)}
				onConfirm={confirmUpdate}
				title='Update Item'
				description='Are you sure you want to update this item?'
				confirmText='Update'
				cancelText='Cancel'
			/>
		</>
	)
}
