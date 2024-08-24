import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Item } from '@/types'
import { useItem } from '@/hooks/useItem'
import { useImage } from '@/hooks/useImage'
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
import { CurrencyCombobox } from '@/components/CurrencyCombobox'

const itemSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	price: z
		.string()
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
			message: 'Price must be a positive number',
		}),
	currency: z.string().min(1, 'Currency is required'),
	variations: z.array(
		z.object({
			name: z.string().min(1, 'Variation name is required'),
			price: z
				.string()
				.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
					message: 'Variation price must be a non-negative number',
				}),
		})
	),
})

type ItemFormData = z.infer<typeof itemSchema>

interface EditItemModalProps {
	isOpen: boolean
	onClose: () => void
	item: Item
	menuId: string
	categoryId: string
	onUpdate: (updatedItem: Partial<Item>) => void
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
	isOpen,
	onClose,
	item,
	menuId,
	categoryId,
	onUpdate,
}) => {
	const [imageUrl, setImageUrl] = useState(item.imageUrl || '')
	const [newImage, setNewImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
	const [isImageRemoved, setIsImageRemoved] = useState(false)

	const { updateItem } = useItem(menuId, categoryId)
	const { uploadImage, deleteImage } = useImage()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ItemFormData>({
		resolver: zodResolver(itemSchema),
		defaultValues: {
			name: item.name,
			description: item.description || '',
			price: item.price.toString(),
			currency: item.currency || '$',
			variations:
				item.variations?.map((v) => ({
					name: v.name,
					price: v.price?.toString() || '0',
				})) || [],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'variations',
	})

	const onSubmit = async (data: ItemFormData) => {
		let updatedImageUrl = isImageRemoved ? null : imageUrl

		if (newImage) {
			try {
				const uploadResult = await uploadImage(newImage)
				updatedImageUrl = uploadResult.url
			} catch (error) {
				toast({
					title: 'Failed to upload new image',
					description:
						error instanceof Error
							? error.message
							: 'An unknown error occurred',
					variant: 'destructive',
				})
				return
			}
		}

		const updatedItem = {
			...data,
			price: parseFloat(data.price),
			imageUrl: updatedImageUrl,
			variations: data.variations.map((v) => ({
				...v,
				price: parseFloat(v.price),
			})),
		}

		updateItem(
			{ itemId: item._id, data: updatedItem },
			{
				onSuccess: () => {
					onUpdate(updatedItem)
					onClose()
					setIsConfirmDialogOpen(false)
				},
				onError: (error) => {
					toast({
						title: 'Failed to update item',
						description:
							error instanceof Error
								? error.message
								: 'An unknown error occurred',
						variant: 'destructive',
					})
				},
			}
		)
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
				await deleteImage(publicId)
				setImageUrl('')
				setNewImage(null)
				setPreviewUrl(null)
				setIsImageRemoved(true)
			} catch (error) {
				toast({
					title: 'Failed to remove image from server',
					description:
						error instanceof Error
							? error.message
							: 'An unknown error occurred',
					variant: 'destructive',
				})
			}
		}
	}

	const getPublicIdFromUrl = (url: string) => {
		const parts = url.split('/')
		const filenameWithExtension = parts.pop() || ''
		return filenameWithExtension.split('.')[0]
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
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='flex-grow overflow-y-auto px-4 py-2'
					>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<Label
									htmlFor='name'
									className='text-sm font-semibold text-gray-700'
								>
									Name
								</Label>
								<Controller
									name='name'
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											placeholder='Item Name'
											className='w-full border-green-500 focus:ring-green-500 focus:border-green-500'
										/>
									)}
								/>
								{errors.name && (
									<p className='text-red-500 text-xs'>{errors.name.message}</p>
								)}
							</div>

							<div className='flex space-x-4'>
								<div className='flex-1 space-y-2'>
									<Label
										htmlFor='price'
										className='text-sm font-semibold text-gray-700'
									>
										Price
									</Label>
									<Controller
										name='price'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												type='number'
												step='0.01'
												placeholder='Item Price'
												className='w-full border-green-500 focus:ring-green-500 focus:border-green-500'
											/>
										)}
									/>
									{errors.price && (
										<p className='text-red-500 text-xs'>
											{errors.price.message}
										</p>
									)}
								</div>

								<div className='flex-1 space-y-2'>
									<Label
										htmlFor='currency'
										className='text-sm font-semibold text-gray-700'
									>
										Currency
									</Label>
									<Controller
										name='currency'
										control={control}
										render={({ field }) => (
											<CurrencyCombobox
												value={field.value}
												onChange={(value) => field.onChange(value)}
											/>
										)}
									/>
									{errors.currency && (
										<p className='text-red-500 text-xs'>
											{errors.currency.message}
										</p>
									)}
								</div>
							</div>

							<div className='space-y-2'>
								<Label
									htmlFor='description'
									className='text-sm font-semibold text-gray-700'
								>
									Description
								</Label>
								<Controller
									name='description'
									control={control}
									render={({ field }) => (
										<Textarea
											{...field}
											placeholder='Item Description'
											className='w-full border-green-500 focus:ring-green-500 focus:border-green-500'
										/>
									)}
								/>
							</div>

							<div className='space-y-2'>
								<Label
									htmlFor='image'
									className='text-sm font-semibold text-gray-700'
								>
									Image
								</Label>
								{!isImageRemoved && (previewUrl || imageUrl) && (
									<img
										src={previewUrl || imageUrl}
										alt={item.name}
										className='w-1/2 h-48 object-cover rounded mb-2 p-1 border border-green-600'
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
											type='button'
										>
											Remove Image
										</Button>
									)}
								</div>
							</div>

							<div className='space-y-2'>
								<Label className='text-sm font-semibold text-gray-700 block'>
									Variations
								</Label>
								{fields.map((field, index) => (
									<div key={field.id} className='flex gap-2 mb-2'>
										<Controller
											name={`variations.${index}.name` as const}
											control={control}
											render={({ field }) => (
												<Input
													{...field}
													placeholder='Variation Name'
													className='flex-1 border-green-500 focus:ring-green-500 focus:border-green-500'
												/>
											)}
										/>
										<Controller
											name={`variations.${index}.price` as const}
											control={control}
											render={({ field }) => (
												<Input
													{...field}
													type='number'
													step='0.01'
													placeholder='Variation Price'
													className='w-24 border-green-500 focus:ring-green-500 focus:border-green-500'
												/>
											)}
										/>
										<Button
											onClick={() => remove(index)}
											variant='destructive'
											className='px-2 py-0'
											type='button'
										>
											<FaTrash />
										</Button>
									</div>
								))}
								{errors.variations && (
									<p className='text-red-500 text-xs mt-1'>
										{errors.variations.message}
									</p>
								)}
								{fields.map((field, index) => (
									<React.Fragment key={field.id}>
										{errors.variations?.[index]?.name && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.variations[index]?.name?.message}
											</p>
										)}
										{errors.variations?.[index]?.price && (
											<p className='text-red-500 text-xs mt-1'>
												{errors.variations[index]?.price?.message}
											</p>
										)}
									</React.Fragment>
								))}
								<Button
									onClick={() => append({ name: '', price: '' })}
									type='button'
									className='mt-2 bg-green-500 hover:bg-green-600'
								>
									<FaPlus className='mr-2' /> Add Variation
								</Button>
							</div>
						</div>
						<DialogFooter className='flex-shrink-0 sm:justify-end mt-4'>
							<Button
								variant='outline'
								onClick={onClose}
								type='button'
								className='mr-2 border-gray-300 text-gray-700 hover:bg-gray-50'
							>
								Cancel
							</Button>
							<Button
								type='submit'
								className='bg-green-500 hover:bg-green-600 text-white'
							>
								Update Item
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<ConfirmationDialog
				isOpen={isConfirmDialogOpen}
				onClose={() => setIsConfirmDialogOpen(false)}
				onConfirm={handleSubmit(onSubmit)}
				title='Update Item'
				description='Are you sure you want to update this item?'
				confirmText='Update'
				cancelText='Cancel'
			/>
		</>
	)
}
