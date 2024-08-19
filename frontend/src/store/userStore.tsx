import { create } from 'zustand'
import { createSelectors } from './createSelectors'
import { persist } from 'zustand/middleware'

type User = {
	username: string
	email: string
}

type UserStore = {
	user: User | null
	setUser: (user: User) => void
	logout: () => void
}

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			logout: () => set({ user: null }),
		}),
		{
			name: 'user-storage',
		}
	)
)

export const useStoreSelectors = createSelectors(useUserStore)
export { useUserStore }
