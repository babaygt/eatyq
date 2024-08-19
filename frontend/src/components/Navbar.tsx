import { NavLink } from 'react-router-dom'

const links = [
	{ name: 'home', path: '/' },
	{ name: 'dashboard', path: '/dashboard' },
	{ name: 'login', path: '/login' },
	{ name: 'register', path: '/register' },
]

export const Navbar = () => {
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
		</nav>
	)
}
