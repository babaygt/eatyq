import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CiMenuFries } from 'react-icons/ci'
import { NavLink, Link } from 'react-router-dom'
import { useStoreSelectors } from '@/store/userStore'
import { useAuth } from '@/hooks/useAuth'

type Props = {
	links: { name: string; path: string }[]
}

export const MobileNavbar = ({ links }: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const user = useStoreSelectors.use.user()
	const { logout, isLoggingOut } = useAuth()

	const closeNav = () => {
		setIsOpen(false)
	}

	const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		logout()
		closeNav()
	}

	return (
		<Sheet open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className='flex justify-center items-center'
				>
					<CiMenuFries className='text-2xl text-accent' />
				</button>{' '}
			</SheetTrigger>
			<SheetContent className='flex flex-col'>
				{/** Logo */}
				<div className='mt-32 mb-8 text-center text-2xl'>
					<Link to='/'>
						<span className='text-3xl font-bold'>
							Eaty<span className='text-3xl font-bold text-green-600 '>Q</span>
						</span>
					</Link>
				</div>
				{/** Nav */}
				<nav className='flex flex-col justify-center items-center gap-8'>
					{links.map((link, index) => {
						return (
							<NavLink
								key={index}
								to={link.path}
								className={({ isActive }) =>
									`${isActive ? 'nav-link-active' : ''} nav-link`
								}
								onClick={closeNav}
							>
								{link.name}
							</NavLink>
						)
					})}
					{user && (
						<button
							className='nav-link'
							onClick={handleLogout}
							disabled={isLoggingOut}
						>
							{isLoggingOut ? 'Logging out...' : 'Logout'}
						</button>
					)}
				</nav>
			</SheetContent>
		</Sheet>
	)
}
