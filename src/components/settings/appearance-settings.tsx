'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useCustomTheme } from '@/providers/custom-theme-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Monitor, Moon, Sun, Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export function AppearanceSettings() {
    const [mounted, setMounted] = useState(false);
    const { theme: colorMode, setTheme: setColorMode } = useTheme();
    const { currentTheme, setTheme, availableThemes } = useCustomTheme();
    const t = useTranslations('Settings.Appearance');

    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!mounted) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Tema
                        </CardTitle>
                        <CardDescription>
                            Carregando configurações...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const handleThemeChange = (newTheme: string) => {
        if (!mounted) return;

        setTheme(newTheme as any);
        const themeName = availableThemes[newTheme as keyof typeof availableThemes]?.name || 'tema';
        // Toast removido para evitar spam visual ou pode ser adicionado se desejado
        toast.success(t('themeApplied', { theme: themeName }));
    };

    const handleColorModeChange = (mode: string) => {
        if (!mounted) return;

        setColorMode(mode);
        const modeName = mode === 'dark' ? 'escuro' : mode === 'light' ? 'claro' : 'automático';
        toast.success(t('modeApplied', { mode: modeName }));
    };

    return (
        <div className="space-y-6">
            {/* Seleção de Tema */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Tema
                    </CardTitle>
                    <CardDescription>
                        Escolha o tema visual que mais combina com você
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={currentTheme || 'ocean'} onValueChange={handleThemeChange}>
                        <div className="grid gap-4">
                            {Object.entries(availableThemes).map(([key, theme]) => (
                                <label
                                    key={key}
                                    htmlFor={`theme-${key}`}
                                    className={cn(
                                        "flex items-center justify-between rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-colors",
                                        currentTheme === key && "border-primary bg-accent"
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value={key} id={`theme-${key}`} />
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{theme.icon}</span>
                                            <div>
                                                <p className="font-medium">{theme.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {theme.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {currentTheme === key && (
                                        <Check className="h-5 w-5 text-primary" />
                                    )}
                                </label>
                            ))}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Modo Claro/Escuro */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5" />
                        Modo de Exibição
                    </CardTitle>
                    <CardDescription>
                        Escolha entre modo claro, escuro ou automático
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={colorMode || 'system'} onValueChange={handleColorModeChange}>
                        <div className="grid gap-4">
                            <label
                                htmlFor="mode-light"
                                className={cn(
                                    "flex items-center justify-between rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-colors",
                                    colorMode === 'light' && "border-primary bg-accent"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="light" id="mode-light" />
                                    <div className="flex items-center space-x-3">
                                        <Sun className="h-5 w-5" />
                                        <div>
                                            <p className="font-medium">Claro</p>
                                            <p className="text-sm text-muted-foreground">
                                                Sempre usar o tema claro
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {colorMode === 'light' && (
                                    <Check className="h-5 w-5 text-primary" />
                                )}
                            </label>

                            <label
                                htmlFor="mode-dark"
                                className={cn(
                                    "flex items-center justify-between rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-colors",
                                    colorMode === 'dark' && "border-primary bg-accent"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="dark" id="mode-dark" />
                                    <div className="flex items-center space-x-3">
                                        <Moon className="h-5 w-5" />
                                        <div>
                                            <p className="font-medium">Escuro</p>
                                            <p className="text-sm text-muted-foreground">
                                                Sempre usar o tema escuro
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {colorMode === 'dark' && (
                                    <Check className="h-5 w-5 text-primary" />
                                )}
                            </label>

                            <label
                                htmlFor="mode-system"
                                className={cn(
                                    "flex items-center justify-between rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-colors",
                                    colorMode === 'system' && "border-primary bg-accent"
                                )}
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="system" id="mode-system" />
                                    <div className="flex items-center space-x-3">
                                        <Monitor className="h-5 w-5" />
                                        <div>
                                            <p className="font-medium">Sistema</p>
                                            <p className="text-sm text-muted-foreground">
                                                Seguir as configurações do sistema
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {colorMode === 'system' && (
                                    <Check className="h-5 w-5 text-primary" />
                                )}
                            </label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Informações adicionais */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                        <div className="rounded-full bg-primary/10 p-2">
                            <Palette className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Dica</p>
                            <p className="text-sm text-muted-foreground">
                                Suas preferências de tema são salvas automaticamente neste navegador.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
