import React from 'react'
import { NavLink } from 'react-router-dom'
import { useStoreSelectors } from '@/store/userStore'
import { useAuth } from '@/hooks/useAuth'

type Props = {
	links: { name: string; path: string }[]
}

export const Navbar = ({ links }: Props) => {
	const user = useStoreSelectors.use.user()
	const { logout, isLoggingOut } = useAuth()

	const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		logout()
	}

	return (
		<nav className='flex gap-8'>
			{links.map((link, index) => {
				return (
					<NavLink
						key={index}
						to={link.path}
						className={({ isActive }) =>
							`${isActive ? 'nav-link-active' : ''} nav-link`
						}
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
	)
}
