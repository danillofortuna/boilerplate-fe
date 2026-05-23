import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/useUserStore';
import { useEffect } from 'react';

export function useCurrentUser() {
    const { user, setUser, setAuthenticated } = useUserStore();

    const query = useQuery({
        queryKey: ['current-user'],
        queryFn: async () => {
            const response = await api.get('/v1/users/me');
            return response.data;
        },
        enabled: !!localStorage.getItem('token'),
        retry: false,
    });

    useEffect(() => {
        if (query.data) {
            setUser(query.data);
            setAuthenticated(true);
        }
    }, [query.data, setUser, setAuthenticated]);

    return { ...query, user: user || query.data };
}
