import React from 'react'
import { Category } from '@/types'
import { Button } from './ui/button'
import { MdDelete } from 'react-icons/md'

interface CategoryTabProps {
	category: Category
	isSelected: boolean
	onClick: () => void
	onDeleteClick?: () => void
	showDeleteButton?: boolean
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
	category,
	isSelected,
	onClick,
	onDeleteClick,
	showDeleteButton = false,
}) => {
	return (
		<div className='relative group inline-block m-1'>
			<Button
				onClick={onClick}
				className={`
                    w-40 h-12 px-4 py-2 rounded-lg transition-all duration-200
                    flex items-center justify-center
                    ${
											isSelected
												? 'bg-green-600 text-white shadow-md hover:bg-green-700'
												: 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900'
										}
                    hover:shadow-lg
                `}
			>
				<span className='truncate text-base font-semibold'>
					{category.name}
				</span>
			</Button>
			{showDeleteButton && onDeleteClick && (
				<button
					onClick={(e) => {
						e.stopPropagation()
						onDeleteClick()
					}}
					className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 
                               opacity-0 group-hover:opacity-100 transition-all duration-200 
                               hover:bg-red-600 transform hover:scale-110 shadow-md'
					aria-label='Delete category'
				>
					<MdDelete className='w-4 h-4' />
				</button>
			)}
		</div>
	)
}
