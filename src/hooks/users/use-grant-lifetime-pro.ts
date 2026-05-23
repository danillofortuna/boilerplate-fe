import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface GrantLifetimeProParams {
    userId: number;
    reason?: string;
}

export function useGrantLifetimePro() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, reason }: GrantLifetimeProParams) => {
            const response = await api.patch(`/users/${userId}/lifetime-pro`, { reason });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('PRO Vitalício concedido com sucesso');
        },
        onError: (error) => {
            toast.error('Erro ao conceder PRO Vitalício');
            console.error(error);
        },
    });
}
