import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';

type ErrorType = {
    title: string;
    details: string;
};

export function useResendEmailVerification(onSuccess?: () => void, onError?: () => void) {
    return useMutation({
        mutationFn: async (data: { email: string }): Promise<any> => {
            const response = await api.post('/v1/users/public/resend-verification', data);
            return response.data;
        },
        onSuccess: (data) => {
            onSuccess?.();
        },
        onError: (error: AxiosError<ErrorType>) => {
            onError?.();
        }
    });
}
