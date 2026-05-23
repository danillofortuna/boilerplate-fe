'use client';

import { useUserStore } from '@/stores/useUserStore';

export function useAuth() {
    const user = useUserStore((state) => state.user);
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);

    const userName = user?.name || null;
    const userEmail = user?.email || null;
    const isUserAdmin = user?.admin || false;

    return {
        user,
        isAuthenticated,
        userName,
        userEmail,
        isUserAdmin,
    };
}
