/**
 * Configuração dinâmica da URL da API
 * 
 * Esta função detecta o ambiente em RUNTIME baseado no hostname atual
 * Não depende de variáveis de ambiente que são resolvidas em build time
 */

function getApiUrl(): string {
    // Se estiver no servidor (SSR), permite override por ENV; caso contrário usa padrão local
    if (typeof window === 'undefined') {
        if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim().length > 0) {
            return process.env.NEXT_PUBLIC_API_URL;
        }
        return 'http://localhost:8080';
    }

    // No cliente, detecta baseado no hostname atual
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Desenvolvimento local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080';
    }

    // Para domínios customizados (exemplo: myapp.com)
    // Extrai o domínio base e usa api.[domínio]
    const domainParts = hostname.split('.');
    if (domainParts.length >= 2) {
        // Pega os últimos 2 elementos (domínio + TLD)
        const baseDomain = domainParts.slice(-2).join('.');

        // Lista de domínios conhecidos que devem usar configuração específica
        // Adicione seus domínios aqui
        const customDomains: string[] = [];

        if (customDomains.includes(baseDomain)) {
            // Detecta se tem prefixo stage
            if (hostname.startsWith('stage.')) {
                return `${protocol}//api-stage.${baseDomain}`;
            }
            return `${protocol}//api.${baseDomain}`;
        }
    }

    // Para preview deployments (Vercel, Netlify)
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
        // Assume que a API está em localhost durante dev ou use env override
        const envUrl = process.env.NEXT_PUBLIC_API_URL;
        if (envUrl && envUrl.trim().length > 0) {
            return envUrl;
        }
        return `${protocol}//api.${hostname}`;
    }

    // Fallback - tenta usar subdomínio api
    return `${protocol}//api.${hostname}`;
}

// Cache da URL para evitar recalcular
let cachedApiUrl: string | null = null;

export function getApiUrlDynamic(): string {
    if (typeof window === 'undefined') {
        // SSR - sempre recalcula
        return getApiUrl();
    }

    // Cliente - usa cache
    if (!cachedApiUrl) {
        cachedApiUrl = getApiUrl();
        console.log('[API Config] Detected API URL:', cachedApiUrl);
    }
    return cachedApiUrl;
}

// Exporta a função ao invés de uma constante
export const API_URL = getApiUrlDynamic();

// Função helper para construir URLs completas
export function buildApiUrl(path: string): string {
    const baseUrl = getApiUrlDynamic();
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBaseUrl}${cleanPath}`;
}

// Exporta configurações adicionais
export const API_CONFIG = {
    get url() { return getApiUrlDynamic(); }, // Getter dinâmico
    timeout: 30000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
};
