import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface RevokeLifetimeProParams {
    userId: number;
    reason?: string;
}

export function useRevokeLifetimePro() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId }: RevokeLifetimeProParams) => {
            const response = await api.delete(`/users/${userId}/lifetime-pro`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('PRO Vitalício revogado com sucesso');
        },
        onError: (error) => {
            toast.error('Erro ao revogar PRO Vitalício');
            console.error(error);
        },
    });
}
