import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'

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
import { toast } from '@/components/ui/use-toast'

const FormSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address.',
	}),
	password: z.string().min(5, {
		message: 'Password must be at least 5 characters.',
	}),
})

const Login = () => {
	const navigate = useNavigate()

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		setTimeout(() => {
			navigate('/')
		}, 2000)

		toast({
			title:
				'You have successfully logged in! Now you will be redirected to the home page.',
			description: (
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		})
	}
	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='w-[80%] max-w-[400px] flex flex-col gap-3 border border-slate-950 p-4 rounded-md bg shadow-md bg-white'
				>
					<h1 className='text-3xl capitalize text-center mb-2'>Login</h1>
					<p className='text-sm text-slate-500 dark:text-slate-400 text-center'>
						{' '}
						Fill in the form below to login.{' '}
					</p>

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
								<FormDescription>Please enter your password.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<p className='text-center'>
						Don't have an account?{' '}
						<Link
							to='/register'
							className='text-slate-900 hover:text-slate-700'
						>
							Register
						</Link>
					</p>

					<Button type='submit'>Submit</Button>
				</form>
			</Form>
		</>
	)
}
export default Login
