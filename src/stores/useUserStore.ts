import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipo do usuário retornado pela API (UserResponseDTO do Spring)
export interface User {
    id: number;
    name: string;
    login: string;
    email: string;
    admin: boolean;
    active: boolean;
    imgUrl?: string;
    createdAt: string;
    lastAccess?: string;
    source?: 'GOOGLE' | 'EMAIL' | string;
    hasLocalPassword?: boolean;
}

// Interface do store
interface UserStore {
    user: User | null;
    isAuthenticated: boolean;

    // Actions
    setUser: (userData: User) => void;
    setAuthenticated: (authenticated: boolean) => void;
    logout: () => void;
}

/**
 * Store global para gerenciar estado do usuário autenticado
 * Utiliza Zustand com persistência no localStorage
 * Funciona com cookies HTTPOnly
 */
export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            setUser: (userData: User) => {
                set({
                    user: userData,
                    isAuthenticated: true,
                });
            },

            setAuthenticated: (authenticated: boolean) => {
                set({ isAuthenticated: authenticated });
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
