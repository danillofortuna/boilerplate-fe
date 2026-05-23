import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { QueryKeys } from '@/lib/query-keys';
import { CreateUserRequest, User } from '@/lib/schemas';
import { AxiosError } from 'axios';

export function useCreateUser(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateUserRequest) => {
            const response = await api.post<User>('/v1/users', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.users.lists()
            });
            toast.success('Usuário criado com sucesso!');
            onSuccess?.();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(
                error?.response?.data?.message ||
                'Erro ao criar usuário. Tente novamente.'
            );
        },
    });
}
