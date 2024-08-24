import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { FaPlus, FaUpload, FaTrash } from 'react-icons/fa'
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

interface CreateItemModalProps {
	isOpen: boolean
	onClose: () => void
	categoryId: string
	menuId: string
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({
	isOpen,
	onClose,
	categoryId,
	menuId,
}) => {
	const [itemImage, setItemImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const { createItem } = useItem(menuId, categoryId)
	const { uploadImage } = useImage()

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ItemFormData>({
		resolver: zodResolver(itemSchema),
		defaultValues: {
			name: '',
			description: '',
			price: '',
			currency: '$',
			variations: [],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'variations',
	})

	const resetForm = () => {
		reset()
		setItemImage(null)
		setPreviewUrl(null)
	}

	const onSubmit = async (data: ItemFormData) => {
		setIsLoading(true)
		try {
			let imageUrl: string | undefined

			if (itemImage) {
				const uploadResult = await uploadImage(itemImage)
				if (uploadResult && uploadResult.url) {
					imageUrl = uploadResult.url
				} else {
					throw new Error('Image upload failed')
				}
			}

			await createItem({
				categoryId,
				name: data.name.trim(),
				description: data.description?.trim(),
				price: parseFloat(data.price),
				currency: data.currency,
				imageUrl,
				variations: data.variations.map((v) => ({
					name: v.name,
					price: parseFloat(v.price),
				})),
			})

			toast({
				title: 'Item created successfully',
				variant: 'success',
			})
			resetForm()
			onClose()
		} catch (error) {
			console.error('Error creating item:', error)
			toast({
				title: 'Failed to create item',
				description:
					error instanceof Error ? error.message : 'An unknown error occurred',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}
	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0]
			setItemImage(file)

			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[600px] max-h-[90vh] bg-white rounded-lg flex flex-col'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-semibold text-green-700 flex items-center'>
						<FaPlus className='mr-2' />
						Create New Item
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
										placeholder='Enter item name'
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
											placeholder='Enter item price'
											className='w-full border-green-500 focus:ring-green-500 focus:border-green-500'
										/>
									)}
								/>
								{errors.price && (
									<p className='text-red-500 text-xs'>{errors.price.message}</p>
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
						<div className='space-y-2 col-span-full'>
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
										placeholder='Enter item description'
										className='border-green-500 focus:ring-green-500 focus:border-green-500'
									/>
								)}
							/>
						</div>
						<div className='space-y-2 col-span-full'>
							<Label
								htmlFor='image'
								className='text-sm font-semibold text-gray-700'
							>
								Image
							</Label>
							{previewUrl && (
								<img
									src={previewUrl}
									alt='Item preview'
									className='w-1/2 h-48 object-cover rounded mb-2 p-1 border border-green-600'
								/>
							)}
							<div className='flex items-center'>
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
									{itemImage ? 'Change Image' : 'Upload Image'}
								</Label>
								{itemImage && (
									<p className='mt-2 text-sm text-gray-500'>{itemImage.name}</p>
								)}
							</div>
						</div>
						<div className='space-y-2 col-span-full'>
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
												className='border-green-500 focus:ring-green-500 focus:border-green-500'
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
												className='border-green-500 focus:ring-green-500 focus:border-green-500'
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
							disabled={isLoading}
							type='button'
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isLoading}
							className='bg-green-600 hover:bg-green-700'
						>
							{isLoading ? 'Creating...' : 'Create Item'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
