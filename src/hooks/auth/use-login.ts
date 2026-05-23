import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { QueryKeys } from "@/lib/query-keys";
import { LoginFormData } from "@/lib/schemas";
import { useUserStore } from "@/stores/useUserStore";
import { useTranslations } from "next-intl";

type ErrorType = {
    title: string;
    details: string;
    message?: string;
};

export function useLogin(onSuccess?: () => void, onError?: () => void) {
    const router = useRouter();
    const setAuthenticated = useUserStore((state) => state.setAuthenticated);
    const setUser = useUserStore((state) => state.setUser);
    const logout = useUserStore((state) => state.logout);
    const t = useTranslations('Auth.Login.errors');

    return useMutation({
        mutationFn: async (loginData: LoginFormData): Promise<unknown> => {
            const response = await api.post('v1/auth/login', loginData);
            return response.data;
        },
        onSuccess: async () => {
            // Limpa dados do usuário anterior
            logout();

            if (typeof window !== 'undefined') {
                localStorage.removeItem('user-storage');
            }

            // Limpa cache do React Query
            queryClient.removeQueries({ queryKey: [QueryKeys.CURRENT_USER] });

            // Seta como autenticado
            setAuthenticated(true);

            // Busca dados do novo usuário
            const userData = await queryClient.fetchQuery({
                queryKey: [QueryKeys.CURRENT_USER],
                queryFn: async () => {
                    const response = await api.get('v1/users/me');
                    return response.data;
                }
            });

            // Seta o usuário no store
            setUser(userData);

            onSuccess?.();
            router.push('/dashboard');
        },
        onError: (error: AxiosError<ErrorType>, variables) => {
            onError?.();

            console.log('🔴 [Login Error]', {
                status: error.response?.status,
                title: error.response?.data?.title,
                details: error.response?.data?.details,
                fullError: error.response?.data
            });

            if (error.response?.status === 401) {
                const errorMessage = error.response?.data?.details || "";
                const errorTitle = error.response?.data?.title || "";

                if (errorTitle === "Email Not Verified" ||
                    errorMessage.includes("Email não verificado") ||
                    errorMessage.includes("Verifique seu email")) {

                    const loginValue = variables.login;
                    const isEmail = loginValue.includes('@');
                    const emailParam = isEmail ? loginValue : '';

                    toast.error(t('emailNotVerified'), {
                        description: "Verifique seu email antes de fazer login. Confira sua caixa de entrada e spam.",
                        duration: 8000,
                        action: emailParam ? {
                            label: "Reenviar email",
                            onClick: () => {
                                router.push(`/email-verification?email=${encodeURIComponent(emailParam)}`);
                            },
                        } : undefined,
                    });
                } else if (errorMessage.includes("Bad credentials") || errorTitle === "Unauthorized") {
                    toast.error(t('invalidCredentials'), {
                        description: "Login ou senha incorretos. Verifique seus dados e tente novamente.",
                    });
                } else {
                    toast.error(t('generic'), {
                        description: errorMessage || "Login ou senha incorretos.",
                    });
                }
            } else if (error.response?.status === 429) {
                const rateLimitData = error.response?.data;
                const errorMessage = rateLimitData?.message ||
                    "Muitas tentativas de login. Tente novamente mais tarde.";
                toast.error(t('manyAttempts'), {
                    description: errorMessage,
                    duration: 5000,
                });
            } else {
                const errorMessage = error.response?.data?.details ||
                    "Um erro aconteceu ao tentar concluir sua solicitação, tente novamente mais tarde.";
                toast.error(t('loginError'), {
                    description: errorMessage,
                });
            }
        }
    });
}
