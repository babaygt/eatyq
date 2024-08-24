import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FaQrcode, FaUtensils, FaMobileAlt, FaSearch } from 'react-icons/fa'
import FeatureCard from '@/components/FeatureCard'
import HowItWorksSection from '@/components/HowItWorksSection'
import { useStoreSelectors } from '@/store/userStore'

const App: React.FC = () => {
	const user = useStoreSelectors.use.user()

	return (
		<div className='min-h-screen bg-gray-100'>
			<main className='container mx-auto px-4 py-8'>
				<section className='text-center mb-16'>
					<h1 className='text-5xl font-bold mb-4'>Welcome to EatyQ</h1>
					<p className='text-xl text-gray-600 mb-8'>
						Create interactive digital menus with QR codes
					</p>
					{!user ? (
						<div className='flex justify-center gap-4'>
							<Button asChild className='bg-green-600 hover:bg-green-700'>
								<Link to='/register'>Get Started</Link>
							</Button>
							<Button asChild variant='outline'>
								<Link to='/login'>Login</Link>
							</Button>
						</div>
					) : (
						<div className='flex flex-col items-center'>
							<p className='text-2xl text-gray-700 mb-4'>
								Welcome back,{' '}
								<span className='text-2xl font-semibold '>
									{user.username}!
								</span>
							</p>
							<Button
								asChild
								className='h-14 px-6 py-4 text-xl bg-green-600 hover:bg-green-700'
							>
								<Link to='/dashboard'>Go to Dashboard</Link>
							</Button>
						</div>
					)}
				</section>

				<section className='mb-16'>
					<h2 className='text-3xl font-semibold text-center mb-8'>
						Why Choose EatyQ?
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						<FeatureCard
							icon={<FaQrcode />}
							title='QR Code Menus'
							description='Generate QR codes for easy access to your digital menu'
						/>
						<FeatureCard
							icon={<FaUtensils />}
							title='Easy Management'
							description='Create and update your menu items with a user-friendly interface'
						/>
						<FeatureCard
							icon={<FaMobileAlt />}
							title='Mobile Friendly'
							description='Responsive design ensures great experience on all devices'
						/>
						<FeatureCard
							icon={<FaSearch />}
							title='Search Function'
							description='Allow customers to easily find items on your menu'
						/>
					</div>
				</section>

				{!user && (
					<section className='text-center mb-16'>
						<h2 className='text-3xl font-semibold mb-4'>
							Ready to Modernize Your Menu?
						</h2>
						<p className='text-xl text-gray-600 mb-8'>
							Join EatyQ today and transform your restaurant's ordering
							experience
						</p>
						<Button
							asChild
							size='lg'
							className='bg-green-600 hover:bg-green-700'
						>
							<Link to='/register'>Create Your Digital Menu</Link>
						</Button>
					</section>
				)}

				<HowItWorksSection />
			</main>
		</div>
	)
}

export default App
