import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CiMenuFries } from 'react-icons/ci'
import { NavLink, Link } from 'react-router-dom'

const links = [
	{ name: 'home', path: '/' },
	{ name: 'dashboard', path: '/dashboard' },
	{ name: 'login', path: '/login' },
	{ name: 'register', path: '/register' },
]

export const MobileNavbar = () => {
	return (
		<Sheet>
			<SheetTrigger>
				<CiMenuFries className='text-2xl text-green-600' />
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
							>
								{link.name}
							</NavLink>
						)
					})}
				</nav>
			</SheetContent>
		</Sheet>
	)
}
