// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useStoreSelectors } from '../store/userStore'
import { loginUser, registerUser, logoutUser } from '../api/userApi'
import { toast } from '../components/ui/use-toast'
import { AxiosError } from 'axios'

type ErrorResponse = {
	message: string
	[key: string]: string | string[] | ErrorResponse | ErrorResponse[] | null
}

export const useAuth = () => {
	const navigate = useNavigate()
	const setUser = useStoreSelectors.use.setUser()
	const logout = useStoreSelectors.use.logout()

	const handleError = (error: unknown) => {
		const axiosError = error as AxiosError<ErrorResponse>
		toast({
			title: 'An error occurred',
			description:
				axiosError.response?.data?.message ||
				(typeof axiosError.response?.data === 'string'
					? axiosError.response?.data
					: JSON.stringify(axiosError.response?.data)) ||
				'Something went wrong',
			variant: 'destructive',
		})
	}

	const loginMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: (data) => {
			toast({
				title: `Welcome back, ${data.username}!`,
				description: 'You have successfully logged in.',
				variant: 'success',
			})
			setUser(data)
			setTimeout(() => {
				navigate('/dashboard')
			}, 2000)
		},
		onError: handleError,
	})

	const registerMutation = useMutation({
		mutationFn: registerUser,
		onSuccess: (data) => {
			toast({
				title: `Welcome, ${data.username}!`,
				description: 'Your account has been created successfully.',
				variant: 'success',
			})
			setUser(data)
			setTimeout(() => {
				navigate('/dashboard')
			}, 2000)
		},
		onError: handleError,
	})

	const logoutMutation = useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			toast({
				title: 'Logged out',
				description: 'You have been logged out successfully.',
				variant: 'success',
			})
			logout()
			setTimeout(() => {
				navigate('/')
			}, 2000)
		},
		onError: handleError,
	})

	return {
		login: loginMutation.mutate,
		register: registerMutation.mutate,
		logout: logoutMutation.mutate,
		isLoggingIn: loginMutation.isPending,
		isRegistering: registerMutation.isPending,
		isLoggingOut: logoutMutation.isPending,
	}
}
