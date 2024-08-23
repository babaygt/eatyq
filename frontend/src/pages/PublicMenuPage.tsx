import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useMenu } from '@/hooks/useMenu'
import { useCategory } from '@/hooks/useCategory'
import { useItem } from '@/hooks/useItem'
import { CategoryTab } from '@/components/CategoryTab'
import { PublicItemCard } from '@/components/PublicItemCard'
import { SearchBar } from '@/components/SearchBar'

const PublicMenuPage: React.FC = () => {
	const { menuId } = useParams<{ menuId: string }>()
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	)
	const [searchTerm, setSearchTerm] = useState('')

	const { useMenuById } = useMenu()
	const { categories } = useCategory(menuId!)
	const { items } = useItem(menuId!, selectedCategoryId!)

	const { data: menu, isLoading: isMenuLoading } = useMenuById(menuId!)

	const filteredItems = useMemo(() => {
		return items?.filter(
			(item) =>
				item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				item.description?.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [items, searchTerm])

	if (isMenuLoading || !menu) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500'></div>
			</div>
		)
	}

	return (
		<div className='container mx-auto p-4 max-w-7xl'>
			<header className='bg-green-100 rounded-lg p-6 mb-8 shadow-md'>
				<h1 className='text-3xl font-bold text-green-800 text-center'>
					{menu.name}
				</h1>
			</header>

			<section className='mb-8'>
				<h2 className='text-2xl font-semibold text-gray-700 mb-4'>
					Categories
				</h2>
				<div className='flex flex-wrap gap-2'>
					{categories?.map((category) => (
						<CategoryTab
							key={category._id}
							category={category}
							isSelected={selectedCategoryId === category._id}
							onClick={() => setSelectedCategoryId(category._id)}
							onDeleteClick={() => {}} // Empty function as we don't want delete functionality here
						/>
					))}
				</div>
			</section>

			{selectedCategoryId && (
				<section className='bg-gray-50 rounded-lg p-6 shadow-md'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-2xl font-semibold text-gray-700'>Items</h2>
						<div className='flex-grow flex justify-center'>
							<div className='w-1/2'>
								<SearchBar onSearch={setSearchTerm} />
							</div>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
						{filteredItems?.map((item) => (
							<PublicItemCard key={item._id} item={item} />
						))}
					</div>
				</section>
			)}
		</div>
	)
}

export default PublicMenuPage
