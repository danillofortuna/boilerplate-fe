import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface UpdateAccessModeParams {
    userId: number;
    accessMode: string;
}

export function useUpdateUserAccessMode() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, accessMode }: UpdateAccessModeParams) => {
            const response = await api.patch(`/users/${userId}/access-mode`, { accessMode: accessMode.toUpperCase() });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Modo de acesso atualizado com sucesso');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar modo de acesso');
            console.error(error);
        },
    });
}
