import React, { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'

interface MainLayoutProps {
	children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<>
			<body>
				{children}
				<Toaster />
			</body>
		</>
	)
}

export default MainLayout
