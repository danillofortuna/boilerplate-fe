import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QueryKeys } from '@/lib/query-keys';

export function useDeleteUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: number[]) => {
            await api.delete('/v1/users', {
                params: { ids: ids.join(',') }
            });
        },
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });

            const message = ids.length === 1
                ? 'Usuário excluído com sucesso!'
                : `${ids.length} usuários excluídos com sucesso!`;

            toast.success(message);
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message || 'Erro ao excluir usuários'
            );
        }
    });
}
