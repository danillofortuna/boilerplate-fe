'use client';

import { useAuth } from '@/hooks/auth';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
    const t = useTranslations('Dashboard');
    const { user, userName } = useAuth();

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('welcome', { name: userName ? `, ${userName.split(' ')[0]}` : '' })}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Card 1 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">{t('cards.totalUsers')}</h3>
                    </div>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                        {t('cards.totalUsersDesc')}
                    </p>
                </div>

                {/* Card 2 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">{t('cards.apiRequests')}</h3>
                    </div>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">
                        {t('cards.apiRequestsDesc')}
                    </p>
                </div>

                {/* Card 3 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">{t('cards.uptime')}</h3>
                    </div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <p className="text-xs text-muted-foreground">
                        {t('cards.uptimeDesc')}
                    </p>
                </div>

                {/* Card 4 */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">{t('cards.status')}</h3>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{t('cards.online')}</div>
                    <p className="text-xs text-muted-foreground">
                        {t('cards.statusDesc')}
                    </p>
                </div>
            </div>

            {/* Info Card */}
            <div className="mt-8 rounded-xl border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">{t('userInfo.title')}</h2>
                <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('userInfo.name')}</span>
                        <span>{user?.name || t('userInfo.na')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('userInfo.email')}</span>
                        <span>{user?.email || t('userInfo.na')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('userInfo.login')}</span>
                        <span>{user?.login || t('userInfo.na')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('userInfo.admin')}</span>
                        <span>{user?.admin ? t('userInfo.yes') : t('userInfo.no')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
