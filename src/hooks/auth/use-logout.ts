'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api, setLoggingOut } from '@/lib/api';
import { queryClient } from '@/lib/query-client';
import { useUserStore } from '@/stores/useUserStore';
import { useTranslations } from 'next-intl';

export function useLogout() {
    const router = useRouter();
    const logout = useUserStore((state) => state.logout);
    const t = useTranslations('Auth.Logout');

    return useMutation({
        mutationFn: async () => {
            // Seta flag para evitar refresh durante logout
            setLoggingOut(true);

            try {
                await api.post('/v1/auth/logout');
            } catch (error) {
                // Ignora erros no logout - vamos limpar mesmo assim
                console.log('[Logout] Erro ignorado:', error);
            }
        },
        onSuccess: () => {
            // Limpa o store local
            logout();

            // Limpa todos os dados do React Query
            queryClient.clear();

            // Limpa localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user-storage');
            }

            toast.success(t('success'));
            router.push('/login');
        },
        onError: () => {
            // Mesmo em caso de erro, faz logout local
            logout();
            queryClient.clear();

            if (typeof window !== 'undefined') {
                localStorage.removeItem('user-storage');
            }

            router.push('/login');
        },
        onSettled: () => {
            // Reseta flag de logout
            setLoggingOut(false);
        }
    });
}
