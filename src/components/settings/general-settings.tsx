'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Info, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Control, useFormContext } from 'react-hook-form';
import { SettingsFormData } from '@/lib/schemas';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';

import { useRouter, usePathname } from '@/i18n/routing';
import { useUpdateUserSettings } from '@/hooks/settings/use-user-settings';

interface GeneralSettingsProps {
    control: Control<SettingsFormData>;
}

export function GeneralSettings({ control }: GeneralSettingsProps) {
    const t = useTranslations('Settings.General');
    const router = useRouter();
    const pathname = usePathname();
    const { getValues } = useFormContext<SettingsFormData>();
    const { mutate: updateSettings } = useUpdateUserSettings();

    return (
        <div className="space-y-6">
            {/* Idioma */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {t('language')}
                    </CardTitle>
                    <CardDescription>
                        {t('subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="locale"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>{t('language')}</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);

                                        // 1. Update Backend
                                        const currentSettings = getValues();
                                        updateSettings({
                                            ...currentSettings,
                                            locale: value as 'pt-BR' | 'en-US'
                                        });

                                        // 2. Force Cookie and Refresh
                                        // We manually set the cookie to ensure middleware picks it up immediately
                                        document.cookie = `NEXT_LOCALE=${value}; path=/; max-age=31536000; SameSite=Lax`;

                                        // 3. Refresh to triggers middleware/server re-render with new locale
                                        router.refresh();
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('languagePlaceholder')} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="pt-BR">
                                            <span>🇧🇷 Português (Brasil)</span>
                                        </SelectItem>
                                        <SelectItem value="en-US">
                                            <span>🇺🇸 English (US)</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Info className="h-3 w-3" />
                                    {t('autoSaveMessage')}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>


        </div>
    );
}
