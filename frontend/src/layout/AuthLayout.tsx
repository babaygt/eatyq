import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

const AuthLayout: React.FC = () => {
	return (
		<div className='min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4'>
			<Outlet />
			<Toaster />
		</div>
	)
}

export default AuthLayout
