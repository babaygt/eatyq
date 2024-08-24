import React from 'react'

const Footer: React.FC = () => {
	return (
		<footer className='bg-gray-800 text-white py-8 mt-16'>
			<div className='container mx-auto px-4 text-center'>
				<p>&copy; {new Date().getFullYear()} EatyQ. All rights reserved.</p>
			</div>
		</footer>
	)
}

export default Footer
