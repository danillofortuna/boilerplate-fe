import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { QueryKeys } from '@/lib/query-keys';

export function useDeleteUser(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            await api.delete(`/v1/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.users.lists()
            });
            toast.success('Usuário excluído com sucesso!');
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message ||
                'Erro ao excluir usuário. Tente novamente.');
        },
    });
}
