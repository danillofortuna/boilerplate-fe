import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface UpdateLimitsParams {
    userId: number;
    limits: {
        maxAccounts: number;
        maxTransactionsPerMonth: number;
        maxCategoriesPerAccount: number;
    };
}

export function useUpdateUserLimits() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, limits }: UpdateLimitsParams) => {
            const response = await api.patch(`/users/${userId}/limits`, limits);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Limites atualizados com sucesso');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar limites');
            console.error(error);
        },
    });
}
