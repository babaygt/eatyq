import React, { useState } from 'react'
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
import { FaPlus, FaUpload } from 'react-icons/fa'

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
	const [itemName, setItemName] = useState('')
	const [itemDescription, setItemDescription] = useState('')
	const [itemPrice, setItemPrice] = useState('')
	const [itemImage, setItemImage] = useState<File | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const { createItem } = useItem(menuId, categoryId)
	const { uploadImage } = useImage()

	const resetForm = () => {
		setItemName('')
		setItemDescription('')
		setItemPrice('')
		setItemImage(null)
	}

	const handleCreateItem = async () => {
		if (itemName.trim() && itemPrice) {
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
					name: itemName.trim(),
					description: itemDescription.trim(),
					price: parseFloat(itemPrice),
					imageUrl,
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
						error instanceof Error
							? error.message
							: 'An unknown error occurred',
					variant: 'destructive',
				})
			} finally {
				setIsLoading(false)
			}
		} else {
			toast({
				title: 'Invalid input',
				description: 'Please provide a name and price for the item.',
				variant: 'destructive',
			})
		}
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setItemImage(e.target.files[0])
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-semibold text-green-700 flex items-center'>
						<FaPlus className='mr-2' />
						Create New Item
					</DialogTitle>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='itemName' className='text-right'>
							Name
						</Label>
						<Input
							id='itemName'
							value={itemName}
							onChange={(e) => setItemName(e.target.value)}
							placeholder='Enter item name'
							className='col-span-3'
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='itemDescription' className='text-right'>
							Description
						</Label>
						<Textarea
							id='itemDescription'
							value={itemDescription}
							onChange={(e) => setItemDescription(e.target.value)}
							placeholder='Enter item description'
							className='col-span-3'
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='itemPrice' className='text-right'>
							Price
						</Label>
						<Input
							id='itemPrice'
							type='number'
							value={itemPrice}
							onChange={(e) => setItemPrice(e.target.value)}
							placeholder='Enter item price'
							className='col-span-3'
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label htmlFor='itemImage' className='text-right'>
							Image
						</Label>
						<div className='col-span-3'>
							<Input
								id='itemImage'
								type='file'
								onChange={handleImageChange}
								accept='image/*'
								className='hidden'
							/>
							<Label
								htmlFor='itemImage'
								className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
							>
								<FaUpload className='mr-2' />
								{itemImage ? 'Change Image' : 'Upload Image'}
							</Label>
							{itemImage && (
								<p className='mt-2 text-sm text-gray-500'>{itemImage.name}</p>
							)}
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant='outline' onClick={onClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleCreateItem}
						disabled={isLoading || !itemName.trim() || !itemPrice}
						className='bg-green-600 hover:bg-green-700'
					>
						{isLoading ? 'Creating...' : 'Create Item'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
