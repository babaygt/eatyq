import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import ErrorPage from './pages/ErrorPage'
import AuthLayout from './layout/AuthLayout.tsx'
import LoginPage from './pages/auth/Login.tsx'
import RegisterPage from './pages/auth/Register.tsx'
import MainLayout from './layout/MainLayout.tsx'

import './index.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout children={<App />} />,
		errorElement: <ErrorPage />,
		children: [
			{
				element: <App />,
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

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
