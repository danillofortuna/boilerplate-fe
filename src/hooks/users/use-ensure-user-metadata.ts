import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function useEnsureUserMetadata() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId: number) => {
            const response = await api.post(`/users/${userId}/ensure-metadata`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Metadata garantido com sucesso');
        },
        onError: (error) => {
            toast.error('Erro ao garantir metadata');
            console.error(error);
        },
    });
}
