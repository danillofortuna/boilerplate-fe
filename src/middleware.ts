import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

// Cache de tokens verificados
const tokenCache = new Map<string, { valid: boolean; expires: number }>();

function getApiUrl(): string {
    return process.env.NODE_ENV === 'production'
        ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
        : 'http://localhost:8080';
}

function validateToken(token: string): { valid: boolean; expires: number } {
    const cached = tokenCache.get(token);
    if (cached && Date.now() < cached.expires - 60000) {
        return cached;
    }

    try {
        const decoded = jwtDecode(token);
        const expires = ((decoded as { exp?: number }).exp || 0) * 1000;
        const valid = expires > Date.now();
        const result = { valid, expires };
        tokenCache.set(token, result);

        if (tokenCache.size > 100) {
            const now = Date.now();
            for (const [key, value] of tokenCache.entries()) {
                if (value.expires < now) {
                    tokenCache.delete(key);
                }
            }
        }
        return result;
    } catch {
        return { valid: false, expires: 0 };
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Run I18n
    const i18nResponse = handleI18n(request);

    if (i18nResponse.status === 307 || i18nResponse.status === 308) {
        return i18nResponse;
    }

    // 2. Auth Logic
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;
    const csrfToken = request.cookies.get('csrf_token')?.value;

    const localeRegex = new RegExp(`^/(${routing.locales.join('|')})`);
    const pathWithoutLocale = pathname.replace(localeRegex, '') || '/';

    const publicRoutes = [
        '/', '/login', '/signup',
        '/forgot-password', '/reset-password',
        '/email-verification', '/verify-email',
        '/api-debug',
    ];

    const oauthRoutes = [
        '/oauth2/authorization',
        '/login/oauth2/code'
    ];

    const isPublic = publicRoutes.includes(pathWithoutLocale);
    const isOauth = oauthRoutes.some(route => pathWithoutLocale.startsWith(route));


    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
        return i18nResponse;
    }

    // API Debug é sempre público
    if (pathname === '/api-debug' || pathname.startsWith('/api-debug/')) {
        return i18nResponse;
    }

    if (isOauth) return i18nResponse;

    if (isPublic) {
        if (accessToken) {
            const tokenInfo = validateToken(accessToken);
            if (tokenInfo.valid) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
        return i18nResponse;
    }

    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (accessToken) {
        const tokenInfo = validateToken(accessToken);
        if (tokenInfo.valid) {
            return i18nResponse;
        }
    }

    if (refreshToken && csrfToken) {
        try {
            const apiUrl = getApiUrl();
            const refreshResponse = await fetch(`${apiUrl}/v1/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                    'Cookie': `refresh_token=${refreshToken}; csrf_token=${csrfToken}`
                },
                credentials: 'include',
            });

            if (refreshResponse.ok) {
                const setCookieHeaders = refreshResponse.headers.getSetCookie();
                setCookieHeaders.forEach(cookieString => {
                    i18nResponse.headers.append('Set-Cookie', cookieString);
                });
                return i18nResponse;
            } else {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)']
};
