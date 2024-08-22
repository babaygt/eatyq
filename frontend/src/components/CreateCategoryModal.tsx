import React, { useState } from 'react'
import { useCategory } from '@/hooks/useCategory'
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
import { FaPlus } from 'react-icons/fa'

interface CreateCategoryModalProps {
	isOpen: boolean
	onClose: () => void
	menuId: string
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
	isOpen,
	onClose,
	menuId,
}) => {
	const [categoryName, setCategoryName] = useState('')
	const { createCategory } = useCategory(menuId)

	const handleCreateCategory = () => {
		if (categoryName.trim()) {
			createCategory(
				{ menuId, name: categoryName.trim() },
				{
					onSuccess: () => {
						setCategoryName('')
						onClose()
					},
				}
			)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px] bg-white rounded-lg'>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold text-green-700 flex items-center'>
						<FaPlus className='mr-2 text-green-700' />
						Create New Category
					</DialogTitle>
				</DialogHeader>
				<div className='py-4'>
					<div className='space-y-2'>
						<Label
							htmlFor='categoryName'
							className='text-sm font-semibold text-gray-700'
						>
							Category Name
						</Label>
						<Input
							id='categoryName'
							value={categoryName}
							onChange={(e) => setCategoryName(e.target.value)}
							placeholder='Enter category name'
							className='w-full border-green-500 focus:ring-green-500 focus:border-green-500 rounded-md'
						/>
					</div>
				</div>
				<DialogFooter className='sm:justify-end gap-3'>
					<Button
						variant='outline'
						onClick={onClose}
						className='mr-2 border-gray-300 text-gray-700 hover:bg-gray-50'
					>
						Cancel
					</Button>
					<Button
						onClick={handleCreateCategory}
						disabled={!categoryName.trim()}
						className='bg-green-500 hover:bg-green-600 text-white'
					>
						Create Category
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
