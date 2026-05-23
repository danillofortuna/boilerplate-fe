import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ChangePasswordFormData } from '@/lib/schemas';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { AxiosError } from 'axios';

interface BackendErrorResponse {
    title?: string;
    details?: string;
    status?: number;
}

export function useChangePassword() {
    const t = useTranslations('Auth.Password');

    return useMutation({
        mutationFn: async (data: ChangePasswordFormData) => {
            // Backend expects: { currentPassword, password }
            const payload = {
                currentPassword: data.currentPassword,
                password: data.newPassword,
            };
            const response = await api.patch('/v1/users/password', payload);
            return response.data;
        },
        onSuccess: () => {
            toast.success(t('success'));
        },
        onError: (error: AxiosError<BackendErrorResponse>) => {
            // Use backend error message if available, otherwise use generic message
            const backendMessage = error.response?.data?.details;
            if (backendMessage) {
                toast.error(backendMessage);
            } else {
                toast.error(t('error'));
            }
        },
    });
}


