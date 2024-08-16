import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

const AuthLayout = () => {
	return (
		<section className='h-cover flex items-center justify-center '>
			<Outlet />
			<Toaster />
		</section>
	)
}

export default AuthLayout
