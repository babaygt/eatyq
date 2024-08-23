import React from 'react'
import { Item } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PublicItemCardProps {
	item: Item
}

export const PublicItemCard: React.FC<PublicItemCardProps> = ({ item }) => {
	return (
		<Card className='flex flex-col h-full rounded-2xl transform transition duration-300 hover:scale-105 hover:shadow-lg'>
			{item.imageUrl && (
				<img
					src={item.imageUrl}
					alt={item.name}
					className='w-full h-48 object-cover rounded-t-2xl'
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
			<CardContent className='flex-grow'>
				<p className='text-sm text-gray-600 mb-4'>{item.description}</p>
				{item.variations && item.variations.length > 0 && (
					<div>
						<p className='font-semibold mb-2'>Variations:</p>
						<ul className='space-y-1'>
							{item.variations.map((variation, index) => (
								<li key={index} className='flex justify-between text-sm'>
									<span>{variation.name}</span>
									<Badge
										variant='secondary'
										className='text-sm bg-green-100 text-green-800'
									>
										${variation.price?.toFixed(2) || 'N/A'}
									</Badge>
								</li>
							))}
						</ul>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
