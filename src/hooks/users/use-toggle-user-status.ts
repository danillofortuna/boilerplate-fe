import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import type { User } from '@/lib/schemas';
import { QueryKeys } from '@/lib/query-keys';

export function useToggleUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, active }: { userId: number; active: boolean }) => {
            const response = await api.patch<User>(`/v1/users/${userId}/status`, null, {
                params: { active }
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalida as queries de usuários
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.detail(variables.userId) });

            const action = variables.active ? 'ativado' : 'desativado';
            toast.success(`Usuário ${action} com sucesso`);
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error.response?.data?.message || 'Erro ao alterar status do usuário';
            toast.error(message);
        }
    });
}
