import React from 'react'
import { Category } from '@/types'
import { Button } from './ui/button'
import { MdDelete } from 'react-icons/md'

interface CategoryTabProps {
	category: Category
	isSelected: boolean
	onClick: () => void
	onDeleteClick: () => void
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
	category,
	isSelected,
	onClick,
	onDeleteClick,
}) => {
	return (
		<div className='relative group'>
			<Button
				onClick={onClick}
				className={`px-4 py-2 rounded-lg transition-all duration-200 ${
					isSelected
						? 'bg-green-600 text-white shadow-md'
						: 'bg-green-100 text-green-800 hover:bg-green-200'
				}`}
			>
				{category.name}
			</Button>
			<button
				onClick={(e) => {
					e.stopPropagation()
					onDeleteClick()
				}}
				className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'
			>
				<MdDelete className='w-4 h-4' />
			</button>
		</div>
	)
}
