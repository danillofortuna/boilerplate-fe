'use client';


import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    LogOut,
    User,
    Settings,
    Users,
    Boxes,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLogout, useAuth } from '@/hooks/auth';

export function Navbar() {
    const t = useTranslations('Navigation');
    const router = useRouter();
    const { mutate: logout } = useLogout();
    const { user, userName, userEmail, isUserAdmin } = useAuth();

    const handleLogout = () => {
        logout();
    };

    // Função para formatar o nome do usuário
    const formatUserName = (name: string | null) => {
        if (!name) return 'User';

        // Pega apenas o primeiro nome
        const firstName = name.split(' ')[0];

        // Primeira letra maiúscula
        const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

        // Se maior que 15 caracteres, adiciona "..."
        if (capitalizedName.length > 15) {
            return capitalizedName.substring(0, 15) + '…';
        }

        return capitalizedName;
    };

    // Iniciais para o avatar
    const getUserInitials = (name: string | null) => {
        if (!name) return 'U';

        const names = name.split(' ');
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }

        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-6 lg:px-8">
                {/* Logo */}
                <div className="mr-4 hidden md:flex">
                    <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                        <Boxes className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block">
                            Boilerplate
                        </span>
                    </Link>
                </div>

                {/* Mobile Logo */}
                <Link href="/dashboard" className="flex md:hidden items-center space-x-2 ml-4">
                    <Boxes className="h-6 w-6 text-primary" />
                    <span className="font-bold">Boilerplate</span>
                </Link>

                {/* Right side - User menu */}
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-auto w-auto rounded-full p-2 hover:bg-muted/50" suppressHydrationWarning>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.imgUrl} alt="Avatar" />
                                        <AvatarFallback>{getUserInitials(userName)}</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:block text-sm font-medium">
                                        {formatUserName(userName)}
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {userName || 'User'}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userEmail || 'user@example.com'}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push('/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>{t('settings')}</span>
                            </DropdownMenuItem>
                            {isUserAdmin && (
                                <DropdownMenuItem onClick={() => router.push('/users')}>
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>{t('users')}</span>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>{t('logout')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
