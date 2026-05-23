import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import type { User, UpdateUserRequest } from '@/lib/schemas';
import { QueryKeys } from '@/lib/query-keys';

export function useUpdateUser(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateUserRequest & { id: number }) => {
            const { id, ...payload } = data;
            const response = await api.put<User>(`/v1/users/${id}`, payload);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.detail(data.id) });
            toast.success('Usuário atualizado com sucesso!');
            onSuccess?.();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error.response?.data?.message || 'Erro ao atualizar usuário';
            toast.error(message);
        }
    });
}

export function useUploadUserImage(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { userId: number; file: File }) => {
            const formData = new FormData();
            formData.append('file', data.file);
            const response = await api.post<User>(`/v1/users/${data.userId}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.CURRENT_USER] });
            toast.success('Imagem atualizada com sucesso!');
            onSuccess?.();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error.response?.data?.message || 'Erro ao fazer upload da imagem';
            toast.error(message);
        }
    });
}

export function useRemoveUserImage(onSuccess?: () => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: number) => {
            const response = await api.delete<User>(`/v1/users/${userId}/image`);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
            queryClient.invalidateQueries({ queryKey: QueryKeys.users.detail(data.id) });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.CURRENT_USER] });
            toast.success('Imagem removida com sucesso!');
            onSuccess?.();
        },
        onError: (error: AxiosError<{ message?: string }>) => {
            const message = error.response?.data?.message || 'Erro ao remover imagem';
            toast.error(message);
        }
    });
}