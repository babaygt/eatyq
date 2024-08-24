import React from 'react'
import { IconType } from 'react-icons'

interface StepProps {
	icon: React.ReactElement<IconType>
	title: string
	description: string
	number: number
}

const Step: React.FC<StepProps> = ({ icon, title, description, number }) => (
	<div
		className='group flex items-start space-x-4 p-6 bg-white rounded-lg shadow-md 
                    hover:shadow-xl transition-all duration-300 ease-in-out 
                    transform hover:scale-105 hover:-translate-y-1 relative
                    cursor-pointer'
	>
		<div
			className='absolute -top-3 -left-3 w-8 h-8 bg-green-500 rounded-full 
                        flex items-center justify-center text-white font-bold
                        transition-transform duration-300 ease-in-out
                        group-hover:scale-110'
		>
			{number}
		</div>
		<div
			className='flex-shrink-0 w-12 h-12 flex items-center justify-center 
                        bg-green-100 rounded-full text-green-600
                        transition-all duration-300 ease-in-out
                        group-hover:bg-green-200 group-hover:text-green-700'
		>
			{icon}
		</div>
		<div>
			<h3
				className='text-lg font-semibold mb-1 transition-colors duration-300 
                           ease-in-out group-hover:text-green-600'
			>
				{title}
			</h3>
			<p
				className='text-gray-600 transition-colors duration-300 ease-in-out 
                          group-hover:text-gray-700'
			>
				{description}
			</p>
		</div>
	</div>
)

export default Step
