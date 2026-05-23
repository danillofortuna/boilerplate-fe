import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface UpdateFeaturesParams {
    userId: number;
    features: {
        canCreateBudgets: boolean;
        canExportData: boolean;
        canUseReports: boolean;
        canUseGoals: boolean;
    };
}

export function useUpdateUserFeatures() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, features }: UpdateFeaturesParams) => {
            const response = await api.patch(`/users/${userId}/features`, features);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Funcionalidades atualizadas com sucesso');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar funcionalidades');
            console.error(error);
        },
    });
}
