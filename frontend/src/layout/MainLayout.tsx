import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<main className='flex-grow'>
				<Outlet />
			</main>
			<Footer />
			<Toaster />
		</div>
	)
}

export default MainLayout
