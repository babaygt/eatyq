import React from 'react'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FaUtensils } from 'react-icons/fa'
import { Menu } from '@/types'

interface MenuCardProps {
	menu: Menu
}

export const MenuCard: React.FC<MenuCardProps> = ({ menu }) => {
	const createdDate = new Date(menu.createdAt).toLocaleDateString()
	const categoryCount = menu.categories?.length ?? 0

	return (
		<Card className='w-full max-w-sm hover:shadow-lg transition-shadow duration-300'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle className='text-xl font-bold text-gray-800'>
						{menu.name}
					</CardTitle>
					<FaUtensils className='text-green-600 w-6 h-6' />
				</div>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div className='flex items-center space-x-2'>
					<Badge variant='secondary' className='bg-green-100 text-green-600'>
						{categoryCount} {categoryCount === 1 ? 'Category' : 'Categories'}
					</Badge>
				</div>
				<p className='text-sm text-gray-600'>Created on {createdDate}</p>
			</CardContent>
			<CardFooter className='flex justify-between items-center'>
				<Button
					variant='link'
					className='text-green-600 hover:text-green-700 p-0 font-semibold'
				>
					View Details
				</Button>
			</CardFooter>
		</Card>
	)
}
