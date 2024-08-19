import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import { MobileNavbar } from './MobileNavbar'
import { useStoreSelectors } from '@/store/userStore'

const allLinks = [
	{ name: 'home', path: '/' },
	{ name: 'dashboard', path: '/dashboard' },
	{ name: 'login', path: '/login' },
	{ name: 'register', path: '/register' },
]

const Header = () => {
	const user = useStoreSelectors.use.user()

	// Filter out login and register links if the user is logged in
	const links = user
		? allLinks.filter(
				(link) => link.name !== 'login' && link.name !== 'register'
		  )
		: allLinks.filter((link) => link.name !== 'dashboard')

	return (
		<header className='py-8 xl:py-12 text-black'>
			<div className='container mx-auto flex justify-between items-center'>
				{/* logo */}
				<Link to='/'>
					<span className='text-3xl font-bold'>
						Eaty<span className='text-3xl font-bold text-green-600 '>Q</span>
					</span>
				</Link>
				{/* desktop nav */}
				<div className='hidden xl:flex items-center gap-8'>
					<Navbar links={links} />
				</div>

				{/* mobile nav */}
				<div className='xl:hidden'>
					<MobileNavbar links={links} />
				</div>
			</div>
		</header>
	)
}
export default Header
