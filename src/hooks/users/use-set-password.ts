import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { UpdatePasswordRequest } from '@/lib/schemas';

export function useSetPassword(onSuccess?: () => void) {
    return useMutation({
        mutationFn: async (data: { id: number; password: string }) => {
            await api.patch(`/v1/users/${data.id}/password`, { password: data.password });
        },
        onSuccess: () => {
            toast.success('Senha definida com sucesso!');
            onSuccess?.();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error.response?.data?.message || 'Erro ao definir senha';
            toast.error(message);
        }
    });
}
