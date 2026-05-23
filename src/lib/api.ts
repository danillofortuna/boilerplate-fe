import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getApiUrlDynamic } from './api-config';

let apiInstance: AxiosInstance | null = null;
let isRefreshing = false;
let isLoggingOut = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error?: unknown) => void;
    config: unknown;
}> = [];

const MAX_RETRY_COUNT = 2;

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

// BroadcastChannel para sincronizar entre abas
let authChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined') {
    authChannel = new BroadcastChannel('auth-sync');

    authChannel.onmessage = (event) => {
        if (event.data.type === 'LOGOUT') {
            // Se recebeu logout de outra aba, redireciona para login
            localStorage.removeItem('user-storage');
            window.location.href = '/login';
        } else if (event.data.type === 'TOKEN_REFRESHED') {
            // Token foi atualizado em outra aba, cancela refresh local se estiver em andamento
            if (isRefreshing) {
                isRefreshing = false;
                processQueue(null);
            }
        }
    };
}

function createApiInstance(): AxiosInstance {
    const instance = axios.create({
        baseURL: getApiUrlDynamic(),
        withCredentials: true,
        timeout: 30000,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    instance.interceptors.request.use(
        (config) => {
            // Para o endpoint de refresh, adicionar CSRF token
            if (config.url?.includes('/auth/refresh')) {
                const csrfToken = getCsrfTokenFromCookie();
                if (csrfToken) {
                    config.headers['X-CSRF-Token'] = csrfToken;
                }
            }

            // Adicionar locale
            const locale = getLocaleFromCookie() || 'pt-BR';
            config.headers['Accept-Language'] = locale;

            config.withCredentials = true;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error) => {
            const originalRequest = error.config;

            // Se logout está em progresso, ignora todos os erros 401
            if (isLoggingOut) {
                return Promise.reject(error);
            }

            // Inicializa o contador de retry se não existir
            if (!originalRequest._retryCount) {
                originalRequest._retryCount = 0;
            }

            // Verificar se é erro 401 e se não excedeu o limite de retries
            if (error.response?.status === 401 && originalRequest && originalRequest._retryCount < MAX_RETRY_COUNT) {
                // Lista de páginas públicas onde 401 é esperado
                const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
                const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

                // Se estamos em uma página pública, não tenta refresh
                if (publicRoutes.includes(currentPath)) {
                    console.log('📍 [API] Em rota pública - não tentará refresh');
                    return Promise.reject(error);
                }

                // Se já estamos tentando fazer refresh do endpoint de refresh
                if (originalRequest.url?.includes('/auth/refresh')) {
                    const errorMessage = error.response?.data?.message || error.response?.data?.error || '';
                    const isTokenReuse = errorMessage.toLowerCase().includes('token') &&
                        (errorMessage.toLowerCase().includes('reuse') ||
                            errorMessage.toLowerCase().includes('invalid'));

                    if (isTokenReuse) {
                        console.log('🔄 [API] Token reuse detectado - outra requisição já renovou o token');
                        return Promise.reject(error);
                    }

                    handleLogout();
                    return Promise.reject(error);
                }

                // Se já está fazendo refresh, adiciona à fila
                if (isRefreshing) {
                    console.log('⏳ [API] Refresh em andamento, adicionando à fila...');
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject, config: originalRequest });
                    })
                        .then(() => {
                            console.log('🔄 [API] Fila liberada, retentando requisição...');
                            return instance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                // Incrementa contador de retry e inicia refresh
                originalRequest._retryCount++;
                isRefreshing = true;

                try {
                    const csrfToken = getCsrfTokenFromCookie();

                    if (!csrfToken) {
                        processQueue(new Error('CSRF token not found'), null);
                        handleLogout();
                        return Promise.reject(new Error('CSRF token not found'));
                    }

                    console.log('🔄 [API] Iniciando refresh token...');

                    // Adiciona timeout para o refresh token
                    const refreshRequest = Promise.race([
                        instance.post('/v1/auth/refresh'),
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('Refresh timeout')), 5000)
                        )
                    ]);

                    const refreshResponse = await refreshRequest as AxiosResponse;

                    if (refreshResponse.status === 200) {
                        console.log('✅ [API] Refresh token bem-sucedido');
                        processQueue(null);

                        // Notifica outras abas que o token foi atualizado
                        authChannel?.postMessage({ type: 'TOKEN_REFRESHED' });

                        // Tenta novamente a requisição original
                        return instance(originalRequest);
                    } else {
                        console.log('❌ [API] Refresh token falhou com status:', refreshResponse.status);
                        processQueue(new Error('Refresh failed'), null);
                        handleLogout();
                        throw new Error('Session expired - refresh token invalid');
                    }
                } catch (refreshError) {
                    const errorStatus = (refreshError as { response?: { status?: number } })?.response?.status;
                    const errorMessage = (refreshError as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.message ||
                        (refreshError as { response?: { data?: { message?: string; error?: string } } })?.response?.data?.error || '';

                    console.log('❌ [API] Erro no refresh token:', errorStatus || (refreshError as Error).message);

                    // Verifica se é erro de token reuse
                    const isTokenReuse = (errorStatus === 401 || errorStatus === 400) &&
                        (errorMessage.toLowerCase().includes('token') &&
                            (errorMessage.toLowerCase().includes('reuse') ||
                                errorMessage.toLowerCase().includes('invalid')));

                    if (isTokenReuse) {
                        console.log('🔄 [API] Token reuse detectado durante refresh - tentando novamente com novo token');
                        await new Promise(resolve => setTimeout(resolve, 100));
                        processQueue(null);
                        return instance(originalRequest);
                    }

                    processQueue(refreshError, null);
                    handleLogout();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
}

function handleLogout() {
    authChannel?.postMessage({ type: 'LOGOUT' });

    if (typeof window !== 'undefined') {
        localStorage.removeItem('user-storage');
        window.location.href = '/login';
    }
}

// Função helper para obter CSRF token do cookie
function getCsrfTokenFromCookie(): string | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrf_token') {
            return decodeURIComponent(value);
        }
    }

    return null;
}

// Função helper para obter Locale do cookie
function getLocaleFromCookie(): string | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'NEXT_LOCALE') {
            return decodeURIComponent(value);
        }
    }

    return null;
}

// Proxy para garantir que sempre usamos a URL correta
export const api = new Proxy({} as AxiosInstance, {
    get(target, prop, receiver) {
        // Se estiver no servidor, sempre cria uma nova instância
        if (typeof window === 'undefined') {
            return Reflect.get(createApiInstance(), prop, receiver);
        }

        // No cliente, reutiliza a instância
        if (!apiInstance) {
            apiInstance = createApiInstance();
        }

        return Reflect.get(apiInstance, prop, receiver);
    }
});

/**
 * Seta a flag de logout em progresso
 * Isso evita que o interceptor tente refresh quando o logout está acontecendo
 */
export function setLoggingOut(value: boolean) {
    isLoggingOut = value;
}
