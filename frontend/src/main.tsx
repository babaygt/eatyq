import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import MainLayout from './layout/MainLayout.tsx'
import AuthLayout from './layout/AuthLayout.tsx'
import RegisterPage from './pages/auth/Register.tsx'
import LoginPage from './pages/auth/Login.tsx'
import ErrorPage from './pages/ErrorPage'
import App from './App.tsx'
import Dashboard from './pages/Dashboard'

import './index.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <App />,
			},
			{
				path: 'dashboard',
				element: <Dashboard />,
			},
		],
	},
	{
		element: <AuthLayout />,
		children: [
			{
				path: 'login',
				element: <LoginPage />,
			},
			{
				path: 'register',
				element: <RegisterPage />,
			},
		],
	},
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools />
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>
)
