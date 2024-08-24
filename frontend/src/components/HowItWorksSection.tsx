import React from 'react'
import {
	FaUserPlus,
	FaListUl,
	FaQrcode,
	FaShareAlt,
	FaMobileAlt,
} from 'react-icons/fa'
import Step from './Step'

const HowItWorksSection: React.FC = () => (
	<section className='bg-gray-50 p-8 rounded-lg shadow-md'>
		<h2 className='text-3xl font-semibold mb-8 text-center'>How It Works</h2>
		<div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
			<Step
				number={1}
				icon={<FaUserPlus className='w-6 h-6' />}
				title='Sign Up'
				description='Create your EatyQ account in minutes'
			/>
			<Step
				number={2}
				icon={<FaListUl className='w-6 h-6' />}
				title='Create Menu'
				description='Add your categories and menu items easily'
			/>
			<Step
				number={3}
				icon={<FaQrcode className='w-6 h-6' />}
				title='Generate QR Code'
				description='Get a unique QR code for your digital menu'
			/>
			<Step
				number={4}
				icon={<FaShareAlt className='w-6 h-6' />}
				title='Share'
				description='Display the QR code in your restaurant or online'
			/>
			<Step
				number={5}
				icon={<FaMobileAlt className='w-6 h-6' />}
				title='Customers Scan'
				description='Patrons access your menu by scanning the QR code'
			/>
		</div>
	</section>
)

export default HowItWorksSection
