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
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa'
const FormSchema = z
	.object({
		username: z.string().min(2, {
			message: 'Username must be at least 2 characters.',
		}),
		email: z.string().email({
			message: 'Invalid email address.',
		}),
		password: z.string().min(5, {
			message: 'Password must be at least 5 characters.',
		}),
		confirmpassword: z.string().min(5, {
			message: 'Password must be same as above.',
		}),
	})
	.superRefine(({ confirmpassword, password }, ctx) => {
		if (confirmpassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords did not match',
				path: ['confirmpassword'],
			})
		}
	})

const Register: React.FC = () => {
	const { register, isRegistering } = useAuth()

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmpassword: '',
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmpassword, ...dataWithoutConfirmPassword } = data
		register(dataWithoutConfirmPassword)
	}

	return (
		<div className='w-full max-w-md p-6 bg-white rounded-xl shadow-lg'>
			<div className='text-center mb-6'>
				<h1 className='text-2xl font-bold text-gray-900'>Create an Account</h1>
				<p className='mt-2 text-sm text-gray-600'>
					Join EatyQ and start creating your digital menu
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='flex items-center text-gray-700'>
									<FaUser className='mr-2' />
									Username
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Enter your username'
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
										placeholder='Create a password'
										type='password'
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
						name='confirmpassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='flex items-center text-gray-700'>
									<FaCheckCircle className='mr-2' />
									Confirm Password
								</FormLabel>
								<FormControl>
									<Input
										placeholder='Confirm your password'
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
						disabled={isRegistering}
						className='w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300'
					>
						{isRegistering ? 'Creating Account...' : 'Create Account'}
					</Button>
				</form>
			</Form>

			<div className='text-center text-sm mt-4'>
				<p className='text-gray-600'>
					Already have an account?{' '}
					<Link
						to='/login'
						className='text-green-600 hover:text-green-800 font-semibold'
					>
						Log in
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

export default Register
