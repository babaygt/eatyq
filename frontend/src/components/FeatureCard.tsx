import React from 'react'
import { IconType } from 'react-icons'

interface FeatureCardProps {
	icon: React.ReactElement<IconType>
	title: string
	description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
	icon,
	title,
	description,
}) => (
	<div className='group bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105'>
		<div className='text-4xl text-green-600 mb-4 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3'>
			{icon}
		</div>
		<h3 className='text-xl font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition-colors duration-300'>
			{title}
		</h3>
		<p className='text-gray-600 group-hover:text-gray-700 transition-colors duration-300'>
			{description}
		</p>
	</div>
)

export default FeatureCard
