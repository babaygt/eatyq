import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { FaSearch } from 'react-icons/fa'

interface SearchBarProps {
	onSearch: (searchTerm: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState('')

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value
		setSearchTerm(term)
		onSearch(term)
	}

	return (
		<div className='relative'>
			<Input
				type='text'
				placeholder='Search items...'
				value={searchTerm}
				onChange={handleSearch}
				className='pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500'
			/>
			<FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
		</div>
	)
}
