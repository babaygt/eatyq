import React, { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import { Outlet } from 'react-router-dom'

interface MainLayoutProps {
	children?: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = () => {
	return (
		<>
			<div>
				<Header />
				<Outlet />
				<Toaster />
			</div>
		</>
	)
}

export default MainLayout
