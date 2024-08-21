import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useStoreSelectors } from '@/store/userStore'
import { getMenus } from '@/api/menuApi'
import { Button } from '@/components/ui/button'
import { MenuCard } from '@/components/MenuCard'
import { CreateMenuModal } from '@/components/CreateMenuModal'
import { Link, useNavigate } from 'react-router-dom'
import { Menu } from '@/types'
import { FaUtensils, FaPlus } from 'react-icons/fa'
import { AxiosError } from 'axios'
import { toast } from '../components/ui/use-toast'

type ErrorResponse = {
	message: string
	[key: string]: string | string[] | ErrorResponse | ErrorResponse[] | null
}

const getGreeting = () => {
	const hour = new Date().getHours()
	if (hour >= 6 && hour < 12) return 'Good morning'
	if (hour >= 12 && hour < 18) return 'Good afternoon'
	if (hour >= 18 && hour < 22) return 'Good evening'
	return 'Good night'
}

const Dashboard = () => {
	const navigate = useNavigate()
	const user = useStoreSelectors.use.user()
	const logout = useStoreSelectors.use.logout()
	const [isCreateMenuModalOpen, setIsCreateMenuModalOpen] = useState(false)
	const {
		data: menus,
		isLoading,
		error,
		isError,
	} = useQuery<Menu[], Error>({
		queryKey: ['menus'],
		queryFn: getMenus,
	})

	if (isLoading)
		return (
			<div className='flex justify-center items-center h-32'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
			</div>
		)
	if (isError) {
		const axiosError = error as AxiosError<ErrorResponse>
		if (axiosError.response?.status === 401) {
			logout()
			toast({
				title: 'Session expired',
				description: 'Please log in again to continue. Redirecting...',
				variant: 'destructive',
			})
			setTimeout(() => {
				navigate('/login')
			}, 1000)
		}

		return (
			<div className='text-red-500 text-center mt-10'>
				Error: {error.message}
			</div>
		)
	}

	return (
		<div className='container mx-auto p-4 max-w-7xl'>
			<header className='mb-8 text-center'>
				{user && (
					<h1 className='text-3xl font-bold mb-2'>
						<span className='text-3xl bg-green-100 text-green-800 p-2 rounded-lg'>
							{getGreeting()},{' '}
							<span className='text-3xl text-green-600'>{user.username}!</span>
						</span>
					</h1>
				)}
				<p className='text-gray-600'>Welcome to your menu dashboard</p>
			</header>

			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-semibold flex items-center'>
					<FaUtensils className='mr-2 text-green-600' />
					Your Menus
				</h2>
				<Button
					onClick={() => setIsCreateMenuModalOpen(true)}
					className='bg-green-600 hover:bg-green-700'
				>
					<FaPlus className='mr-2' />
					Create New Menu
				</Button>
			</div>

			{menus && menus.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{menus.map((menu) => (
						<Link
							key={menu._id}
							to={`/menu/${menu._id}`}
							className='transform transition duration-300 hover:scale-105'
						>
							<MenuCard menu={menu} />
						</Link>
					))}
				</div>
			) : (
				<div className='text-center py-10 bg-gray-100 rounded-lg'>
					<p className='text-xl text-gray-600 mb-4'>
						You haven't created any menus yet.
					</p>
					<Button
						onClick={() => setIsCreateMenuModalOpen(true)}
						className='bg-green-600 hover:bg-green-700'
					>
						<FaPlus className='mr-2' />
						Create Your First Menu
					</Button>
				</div>
			)}

			<CreateMenuModal
				isOpen={isCreateMenuModalOpen}
				onClose={() => setIsCreateMenuModalOpen(false)}
			/>
		</div>
	)
}

export default Dashboard
