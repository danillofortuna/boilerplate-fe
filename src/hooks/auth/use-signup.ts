import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { SignupFormData } from '@/lib/schemas';

type ErrorType = {
    title: string;
    details: string;
};

export function useSignup(onSuccess?: () => void, onError?: () => void) {
    const router = useRouter();

    return useMutation({
        mutationFn: async (signupData: SignupFormData): Promise<any> => {
            const response = await api.post('/v1/users/public/signup', signupData);
            return { user: response.data, email: signupData.email };
        },
        onSuccess: async (data) => {
            onSuccess?.();
            // Redireciona para página de verificação com o email
            router.push(`/email-verification?email=${encodeURIComponent(data.email)}`);
        },
        onError: (error: AxiosError<ErrorType>) => {
            onError?.();

            if (error.response?.status === 400) {
                const details = error.response?.data?.details;
                const title = error.response?.data?.title;

                // Erro específico de validação de senha
                if (title === 'Erro na validação da senha' || details?.includes('senha deve conter')) {
                    toast.error('Senha não atende aos critérios', {
                        description: details || 'A senha deve ter no mínimo 8 caracteres e conter pelo menos um número, uma letra minúscula, uma letra maiúscula e um caractere especial (@#$%^&+=!)',
                    });
                } else if (details?.includes('já existe') || details?.includes('already exists')) {
                    toast.error('Usuário já existe', {
                        description: 'Este email já está cadastrado no sistema.',
                    });
                } else {
                    toast.error('Dados inválidos', {
                        description: details || 'Verifique os dados informados e tente novamente.',
                    });
                }
            } else {
                toast.error('Um erro aconteceu ao tentar concluir sua solicitação, tente novamente mais tarde.');
            }
        }
    });
}
