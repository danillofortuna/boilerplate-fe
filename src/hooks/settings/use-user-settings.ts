import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SettingsFormData } from '@/lib/schemas';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export interface UserSettings {
    locale: 'pt-BR' | 'en-US';
    currency: string;
    notifications: {
        billDueDateReminderDays: number;
        monthlyReportEmail: boolean;
    };
    preferences: {
        defaultAccountId: number | null;
        defaultExpenseCategoryId: number | null;
        recurringReminderDays: number;
        autoCategorizationEnabled: boolean;
        useAverageForVariablePending: boolean;
    };
}

const mockSettings: UserSettings = {
    locale: 'pt-BR',
    currency: 'BRL',
    notifications: {
        billDueDateReminderDays: 3,
        monthlyReportEmail: true,
    },
    preferences: {
        defaultAccountId: null,
        defaultExpenseCategoryId: null,
        recurringReminderDays: 5,
        autoCategorizationEnabled: false,
        useAverageForVariablePending: false,
    },
};

export function useUserSettings() {
    return useQuery({
        queryKey: ['user-settings'],
        queryFn: async () => {
            // Fetch validation: user endpoint returns UserResponseDTO which contains metadata
            const response = await api.get<any>('/v1/users/me');
            const user = response.data;

            // Map UserResponseDTO -> SettingsFormData
            // Default values for fields not yet in backend
            return {
                locale: user.metadata?.locale || 'pt-BR',
                currency: user.metadata?.currency || 'BRL',
                notifications: {
                    billDueDateReminderDays: 3,
                    monthlyReportEmail: true,
                },
                preferences: {
                    defaultAccountId: null,
                    defaultExpenseCategoryId: null,
                    recurringReminderDays: 5,
                    autoCategorizationEnabled: false,
                    useAverageForVariablePending: false,
                }
            } as UserSettings;
        },
    });
}

export function useUpdateUserSettings() {
    const queryClient = useQueryClient();
    const t = useTranslations('Settings');

    return useMutation({
        mutationFn: async (data: SettingsFormData) => {
            // We strip 'preferences' and 'notifications' from data if the backend only accepts flat fields
            // BUT, wait, current SettingsFormData has nested objects.
            // The backend UserPutRequestDTO is flat: name, imgUrl, locale, currency.
            // So we need to map SettingsFormData -> UserPutRequestDTO format.
            // Actually, we should just send { locale: data.locale, currency: data.currency }

            const payload = {
                locale: data.locale,
                currency: data.currency
            };

            // Using PUT /v1/users which accepts partial updates per our backend logic
            const response = await api.put('/v1/users', payload);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success(t('settingsSaved'));
            queryClient.invalidateQueries({ queryKey: ['user-settings'] });
            // Optionally update global user store or trigger refresh if needed
        },
        onError: () => {
            toast.error(t('settingsSaveError'));
        },
    });
}
