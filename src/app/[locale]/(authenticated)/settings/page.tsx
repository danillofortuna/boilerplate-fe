'use client';

import { Suspense, useState, useEffect } from 'react'; // Removed unused imports
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
    Save,
    Loader2,
    Bell,
    Settings as SettingsIcon,
    Palette,
    Crown,
    User
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';
import { PageContainer } from '@/components/layout/page-container';

import { settingsSchema, SettingsFormData } from '@/lib/schemas';
import { useUserSettings, useUpdateUserSettings } from '@/hooks/settings/use-user-settings';
import { AppearanceSettings } from '@/components/settings/appearance-settings';
import { GeneralSettings } from '@/components/settings/general-settings';
import { NotificationSettings } from '@/components/settings/notification-settings';
import { SubscriptionSettings } from '@/components/settings/subscription-settings';
import { ProfileSettings } from '@/components/settings/profile-settings'; // New import

function SettingsContent() {
    const t = useTranslations('Settings');
    const searchParams = useSearchParams();
    const tabFromUrl = searchParams.get('tab');

    const { data: userSettings } = useUserSettings();
    const { mutate: updateSettings, isPending: isUpdatingSettings } = useUpdateUserSettings();

    const [activeTab, setActiveTab] = useState(tabFromUrl || 'profile');

    // Settings Form (for General, Notifications, etc.)
    const settingsForm = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
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
        },
    });

    // Load initial settings data
    useEffect(() => {
        if (userSettings) {
            settingsForm.reset(userSettings);
        }
    }, [userSettings, settingsForm]);

    // Update active tab from URL if it changes
    useEffect(() => {
        if (tabFromUrl) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setActiveTab((prev) => (prev !== tabFromUrl ? tabFromUrl : prev));
        }
    }, [tabFromUrl]);

    const onSettingsSubmit = (data: SettingsFormData) => {
        updateSettings(data);
    };

    return (
        <PageContainer scrollable>
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <SettingsIcon className="h-5 w-5 text-primary" />
                        </div>
                        {t('title')}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {t('subtitle')}
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none mb-6 overflow-x-auto flex-nowrap scrollbar-none">
                        <TabsTrigger
                            value="profile"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 flex items-center gap-2"
                        >
                            <User className="h-4 w-4" />
                            {t('tabs.profile')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="general"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 flex items-center gap-2"
                        >
                            <SettingsIcon className="h-4 w-4" />
                            {t('tabs.general')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 flex items-center gap-2"
                        >
                            <Bell className="h-4 w-4" />
                            {t('tabs.notifications')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="subscription"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 flex items-center gap-2"
                        >
                            <Crown className="h-4 w-4" />
                            {t('tabs.subscription')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="appearance"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 flex items-center gap-2"
                        >
                            <Palette className="h-4 w-4" />
                            {t('tabs.appearance')}
                        </TabsTrigger>
                    </TabsList>

                    {/* Main Content Area */}
                    <div className="min-h-[400px]">
                        <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
                            <ProfileSettings />
                        </TabsContent>

                        <TabsContent value="general" className="mt-0 focus-visible:outline-none space-y-6">
                            <Form {...settingsForm}>
                                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
                                    <div className="bg-card rounded-xl border p-6 space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">{t('General.title')}</h3>
                                            <p className="text-sm text-muted-foreground">{t('General.subtitle')}</p>
                                        </div>
                                        <div className="max-w-xl">
                                            <GeneralSettings control={settingsForm.control} />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-6">
                                        <Button type="submit" disabled={isUpdatingSettings}>
                                            {isUpdatingSettings && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Save className="mr-2 h-4 w-4" />
                                            {t('save')}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </TabsContent>

                        <TabsContent value="notifications" className="mt-0 focus-visible:outline-none space-y-6">
                            <Form {...settingsForm}>
                                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}>
                                    <div className="bg-card rounded-xl border p-6 space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">Notificações</h3>
                                            <p className="text-sm text-muted-foreground">Gerencie seus alertas</p>
                                        </div>
                                        <NotificationSettings control={settingsForm.control} />
                                    </div>
                                    <div className="flex justify-end pt-6">
                                        <Button type="submit" disabled={isUpdatingSettings}>
                                            {isUpdatingSettings && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <Save className="mr-2 h-4 w-4" />
                                            {t('save')}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </TabsContent>

                        <TabsContent value="subscription" className="mt-0 focus-visible:outline-none space-y-6">
                            <div className="bg-card rounded-xl border p-6 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Assinatura</h3>
                                    <p className="text-sm text-muted-foreground">Detalhes do seu plano atual</p>
                                </div>
                                <SubscriptionSettings />
                            </div>
                        </TabsContent>

                        <TabsContent value="appearance" className="mt-0 focus-visible:outline-none space-y-6">
                            <div className="bg-card rounded-xl border p-6 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Aparência</h3>
                                    <p className="text-sm text-muted-foreground">Personalize a experiência visual</p>
                                </div>
                                <AppearanceSettings />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </PageContainer>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-full min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
