import React, { useState } from 'react'
import { useMenu } from '@/hooks/useMenu'
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

interface CreateMenuModalProps {
	isOpen: boolean
	onClose: () => void
}

export const CreateMenuModal: React.FC<CreateMenuModalProps> = ({
	isOpen,
	onClose,
}) => {
	const [menuName, setMenuName] = useState('')
	const { createMenu } = useMenu()

	const handleCreateMenu = () => {
		if (menuName.trim()) {
			createMenu(
				{ name: menuName.trim() },
				{
					onSuccess: () => {
						setMenuName('')
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
						Create New Menu
					</DialogTitle>
				</DialogHeader>
				<div className='py-4'>
					<div className='space-y-2'>
						<Label
							htmlFor='menuName'
							className='text-sm font-semibold text-gray-700'
						>
							Menu Name
						</Label>
						<Input
							id='menuName'
							value={menuName}
							onChange={(e) => setMenuName(e.target.value)}
							placeholder='Enter menu name'
							className='w-full border-green-500 focus:ring-green-500 focus:border-green-500 rounded-md'
						/>
					</div>
				</div>
				<DialogFooter className='sm:justify-end'>
					<Button
						variant='outline'
						onClick={onClose}
						className='mr-2 border-gray-300 text-gray-700 hover:bg-gray-50'
					>
						Cancel
					</Button>
					<Button
						onClick={handleCreateMenu}
						disabled={!menuName.trim()}
						className='bg-green-500 hover:bg-green-600 text-white'
					>
						Create Menu
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
