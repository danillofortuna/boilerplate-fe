import {
    Home,
    Users,
    Settings,
    BarChart,
    LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
    name: string;
    href: string;
    icon: LucideIcon;
    adminOnly?: boolean;
}

export interface NavigationSection {
    title: string;
    items: NavigationItem[];
}

export const navigationItems: NavigationSection[] = [
    {
        title: 'mainMenu',
        items: [
            {
                name: 'dashboard',
                href: '/dashboard',
                icon: Home,
            },
            {
                name: 'users',
                href: '/users',
                icon: Users,
                adminOnly: true,
            },
        ]
    },
    {
        title: 'configuration',
        items: [
            {
                name: 'reports',
                href: '/reports',
                icon: BarChart,
            },
            {
                name: 'settings',
                href: '/settings',
                icon: Settings,
            },
        ]
    }
];

/**
 * Filtra os itens de navegação com base nas permissões do usuário
 */
export function filterNavigationItems(sections: NavigationSection[], isAdmin: boolean): NavigationSection[] {
    return sections
        .map(section => ({
            ...section,
            items: section.items.filter(item => !item.adminOnly || isAdmin)
        }))
        .filter(section => section.items.length > 0);
}
