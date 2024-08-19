import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

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

const Register = () => {
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
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='w-[80%] max-w-[400px] flex flex-col gap-3 border border-slate-950 p-4 rounded-md bg shadow-md bg-white'
				>
					<h1 className='text-3xl capitalize text-center mb-2'>Register</h1>
					<p className='text-sm text-slate-500 dark:text-slate-400 text-center'>
						Fill in the form below to register.
					</p>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='font-semibold'>Username</FormLabel>
								<FormControl>
									<Input placeholder='Username' {...field} />
								</FormControl>
								<FormDescription>
									Please enter your username. Must be at least 2 characters.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='font-semibold'>Email</FormLabel>
								<FormControl>
									<Input placeholder='Email' {...field} />
								</FormControl>
								<FormDescription>Please enter your email.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='font-semibold'>Password</FormLabel>
								<FormControl>
									<Input type='password' placeholder='Password' {...field} />
								</FormControl>
								<FormDescription>
									Please enter your password. Must be at least 5 characters.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='confirmpassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='font-semibold'>
									Confirm Password
								</FormLabel>
								<FormControl>
									<Input
										type='password'
										placeholder='Confirm Password'
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Please enter your password again. Must be same as above.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<p className='text-center '>
						Already have an account?{' '}
						<Link
							to='/login'
							className='text-green-600 hover:text-green-600/80'
						>
							Login
						</Link>
					</p>

					<p className='text-center'>
						Back to{' '}
						<Link to='/' className='text-green-600 hover:text-green-600/80'>
							Homepage
						</Link>
					</p>

					<Button type='submit' disabled={isRegistering}>
						{isRegistering ? 'Registering...' : 'Submit'}
					</Button>
				</form>
			</Form>
		</>
	)
}

export default Register
