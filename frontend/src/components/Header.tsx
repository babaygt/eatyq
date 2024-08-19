import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import { MobileNavbar } from './MobileNavbar'

const Header = () => {
	return (
		<header className='py-8 xl:py-12 text-black '>
			<div className='container mx-auto flex justify-between items-center'>
				{/* logo */}
				<Link to='/'>
					<span className='text-3xl font-bold'>
						Eaty<span className='text-3xl font-bold text-green-600 '>Q</span>
					</span>
				</Link>
				{/* desktop nav*/}
				<div className='hidden xl:flex items-center gap-8'>
					<Navbar />
				</div>

				{/* mobile nav */}
				<div className='xl:hidden'>
					<MobileNavbar />
				</div>
			</div>
		</header>
	)
}
export default Header
