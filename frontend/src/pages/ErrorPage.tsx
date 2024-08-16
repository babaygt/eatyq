import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const ErrorPage = () => {
	return (
		<section className='h-screen flex items-center justify-center'>
			<div className='flex flex-col items-center justify-center gap-2'>
				<h1 className='text-red-700 text-4xl font-bold'>Oops!</h1>
				<p className='text-red-700 text-3xl font-bold'>
					Sorry, an unexpected error has occurred.
				</p>

				<Button
					asChild
					className='bg-red-700 text-slate-50 hover:bg-red-700/90 '
				>
					<Link to='/'>Go to Home</Link>
				</Button>
			</div>
		</section>
	)
}
export default ErrorPage
