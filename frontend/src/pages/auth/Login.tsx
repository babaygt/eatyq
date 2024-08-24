import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FaEnvelope, FaLock } from 'react-icons/fa'

const FormSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address.',
	}),
	password: z.string().min(5, {
		message: 'Password must be at least 5 characters.',
	}),
})

const Login: React.FC = () => {
	const { login, isLoggingIn } = useAuth()

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		login(data)
	}

	return (
		<div className='w-full max-w-md p-6 bg-white rounded-xl shadow-lg'>
			<div className='text-center mb-6'>
				<h1 className='text-2xl font-bold text-gray-900'>Welcome Back</h1>
				<p className='mt-2 text-sm text-gray-600'>
					Log in to access your EatyQ account
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='flex items-center text-gray-700'>
									<FaEnvelope className='mr-2' />
									Email
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter your email'
										type='email'
										className='w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-red-500 text-xs' />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='flex items-center text-gray-700'>
									<FaLock className='mr-2' />
									Password
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter your password'
										type='password'
										className='w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage className='text-red-500 text-xs' />
							</FormItem>
						)}
					/>

					<Button
						type='submit'
						disabled={isLoggingIn}
						className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300'
					>
						{isLoggingIn ? 'Logging in...' : 'Log In'}
					</Button>
				</form>
			</Form>

			<div className='text-center text-sm mt-4'>
				<p className='text-gray-600'>
					Don't have an account?{' '}
					<Link
						to='/register'
						className='text-green-600 hover:text-green-800 font-semibold'
					>
						Register
					</Link>
				</p>
				<p className='mt-2 text-gray-600'>
					<Link
						to='/'
						className='text-green-600 hover:text-green-800 font-semibold'
					>
						Back to Homepage
					</Link>
				</p>
			</div>
		</div>
	)
}

export default Login
