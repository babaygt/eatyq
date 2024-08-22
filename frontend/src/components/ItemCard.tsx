import React, { useState } from 'react'
import { Item } from '@/types'
import { useItem } from '@/hooks/useItem'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/ConfirmationDialog'
import { EditItemModal } from '@/components/EditItemModal'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ItemCardProps {
	item: Item
	menuId: string
	categoryId: string
	onDelete: () => void
	onUpdate: (updatedItem: Partial<Item>) => void
}

export const ItemCard: React.FC<ItemCardProps> = ({
	item,
	menuId,
	categoryId,
	onDelete,
	onUpdate,
}) => {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const { deleteItem } = useItem(menuId, categoryId)

	const handleDelete = () => {
		deleteItem(item._id, {
			onSuccess: () => {
				setIsDeleteDialogOpen(false)
				onDelete() // Call the passed onDelete prop
			},
		})
	}

	const handleUpdate = (updatedItem: Partial<Item>) => {
		onUpdate(updatedItem) // Call the passed onUpdate prop
	}
	return (
		<Card className='flex flex-col h-full rounded-2xl transform transition duration-300 hover:scale-105 hover:shadow-lg'>
			{item.imageUrl && (
				<img
					src={item.imageUrl}
					alt={item.name}
					className='w-full h-48 object-cover rounded-2xl'
				/>
			)}
			<CardHeader>
				<CardTitle className='flex justify-between items-center'>
					<span>{item.name}</span>
					<Badge
						variant='secondary'
						className='text-sm bg-green-100 text-green-800'
					>
						${item.price.toFixed(2)}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className='flex-grow min-h-[100px]'>
				<p className='text-sm text-gray-600 mb-4'>{item.description}</p>
				{item.variations && item.variations.length > 0 && (
					<div>
						<p className='font-semibold mb-2'>Variations:</p>
						<ul className='space-y-1'>
							{item.variations.map((variation, index) => (
								<li
									key={index}
									className='flex justify-between text-sm items-center p-1 rounded-md group hover:bg-gray-100 transition-colors duration-200'
								>
									<span className='group-hover:text-gray-900 transition-colors duration-200'>
										{variation.name}
									</span>
									<Badge
										variant='secondary'
										className='text-sm bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:text-green-900 transition-colors duration-200'
									>
										${variation.price?.toFixed(2) || 'N/A'}
									</Badge>
								</li>
							))}
						</ul>
					</div>
				)}
			</CardContent>
			<CardFooter className='mt-auto'>
				<div className='flex justify-end gap-2 w-full'>
					<Button
						variant='destructive'
						onClick={() => setIsDeleteDialogOpen(true)}
					>
						Delete
					</Button>
					<Button className='grow' onClick={() => setIsEditModalOpen(true)}>
						Edit
					</Button>
				</div>
			</CardFooter>
			<ConfirmationDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleDelete}
				title='Delete Item'
				description='Are you sure you want to delete this item? This action cannot be undone.'
				confirmText='Delete'
				cancelText='Cancel'
			/>
			<EditItemModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				item={item}
				menuId={menuId}
				categoryId={categoryId}
				onUpdate={handleUpdate}
			/>
		</Card>
	)
}
