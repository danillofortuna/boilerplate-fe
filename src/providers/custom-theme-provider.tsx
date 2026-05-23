'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { themes, ThemeValue, generateThemeCSSVars } from '@/lib/themes';

interface CustomThemeContextType {
    currentTheme: ThemeValue;
    setTheme: (theme: ThemeValue) => void;
    availableThemes: typeof themes;
}

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

// Tema padrão para novos usuários
const DEFAULT_THEME: ThemeValue = 'violetbloom';

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme: colorMode } = useTheme(); // 'light' | 'dark' | 'system'
    const [currentTheme, setCurrentTheme] = useState<ThemeValue>(DEFAULT_THEME);
    const [mounted, setMounted] = useState(false);

    // Carrega o tema salvo no localStorage
    useEffect(() => {
        setMounted(true);
        try {
            const savedTheme = localStorage.getItem('freebills-theme') as ThemeValue;
            if (savedTheme && themes[savedTheme]) {
                setCurrentTheme(savedTheme);
            } else {
                // Se não houver tema salvo, salva o tema padrão
                localStorage.setItem('freebills-theme', DEFAULT_THEME);
            }
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
            // Em caso de erro, usa o tema padrão
            setCurrentTheme(DEFAULT_THEME);
        }
    }, []);

    // Atualiza as variáveis CSS quando o tema ou modo mudam
    // (exceto na primeira montagem, pois o script já aplicou)
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (!mounted || typeof window === 'undefined') return;

        // Se é a primeira carga, pula (o script já aplicou)
        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }

        // Determina se deve usar dark mode
        let isDark = false;
        if (colorMode === 'dark') {
            isDark = true;
        } else if (colorMode === 'system') {
            // Verifica a preferência do sistema
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        const theme = themes[currentTheme];

        if (!theme) return; // Proteção adicional

        const cssVars = generateThemeCSSVars(theme, isDark);

        // Aplica as variáveis CSS no root
        const root = document.documentElement;
        Object.entries(cssVars).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // Aplica o tema no body para letter-spacing
        if (document.body) {
            document.body.style.letterSpacing = 'var(--tracking-normal)';
        }
    }, [currentTheme, colorMode, mounted, isInitialLoad]);

    // Listener para mudanças na preferência do sistema
    useEffect(() => {
        if (!mounted || colorMode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            // Força atualização quando a preferência do sistema muda
            const isDark = mediaQuery.matches;
            const theme = themes[currentTheme];

            if (!theme) return;

            const cssVars = generateThemeCSSVars(theme, isDark);
            const root = document.documentElement;
            Object.entries(cssVars).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [currentTheme, colorMode, mounted]);

    const handleSetTheme = (theme: ThemeValue) => {
        setCurrentTheme(theme);
        localStorage.setItem('freebills-theme', theme);
    };

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <CustomThemeContext.Provider
            value={{
                currentTheme,
                setTheme: handleSetTheme,
                availableThemes: themes,
            }}
        >
            {children}
        </CustomThemeContext.Provider>
    );
}

export function useCustomTheme() {
    const context = useContext(CustomThemeContext);
    if (!context) {
        // Retorna valores padrão durante a renderização no servidor ou antes do provider estar montado
        return {
            currentTheme: 'ocean' as ThemeValue,
            setTheme: () => { },
            availableThemes: themes,
        };
    }
    return context;
}
