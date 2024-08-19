import { useStoreSelectors } from '@/store/userStore'

const Dashboard = () => {
	const user = useStoreSelectors.use.user()

	return (
		<div>
			Dashboard
			{user && <div>Welcome {user.username}</div>}
			{!user && <div>Please login</div>}
		</div>
	)
}
export default Dashboard
