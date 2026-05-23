import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/providers/sidebar-provider';
import { useAuth } from '@/hooks/auth';
import { navigationItems, filterNavigationItems } from '@/config/navigation';

export function Sidebar() {
    const t = useTranslations('Navigation');
    const { isExpanded, toggleSidebar } = useSidebar();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab');
    const { isUserAdmin } = useAuth();

    // Filtra os itens de navegação com base nas permissões
    const filteredNavigation = filterNavigationItems(navigationItems, isUserAdmin);

    // Função para verificar se o item está ativo
    const isItemActive = (href: string) => {
        // Se o href tem query params (ex: /settings?tab=open-finance)
        if (href.includes('?')) {
            const [path, query] = href.split('?');
            const params = new URLSearchParams(query);
            const tab = params.get('tab');
            return pathname === path && currentTab === tab;
        }
        // Para URLs sem query params, só verifica o pathname
        // Mas não marca como ativo se há um tab específico selecionado
        if (pathname === href && !currentTab) {
            return true;
        }
        if (pathname === href && href !== '/settings') {
            return true;
        }
        return false;
    };

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300 ease-in-out",
                    isExpanded ? "w-64" : "w-16",
                    "hidden md:block" // Esconde em telas pequenas
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Toggle Button */}
                    <div className="flex h-12 items-center justify-end px-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={toggleSidebar}
                            aria-label={isExpanded ? "Recolher sidebar" : "Expandir sidebar"}
                        >
                            {isExpanded ? (
                                <ChevronLeft className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
                        {filteredNavigation.map((section, idx) => (
                            <div key={section.title}>
                                {idx > 0 && <Separator className="my-2" />}

                                {isExpanded && (
                                    <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t(section.title as any)}
                                    </h3>
                                )}

                                <div className="space-y-1">
                                    {section.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = isItemActive(item.href);

                                        const linkContent = (
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent group relative",
                                                    isActive
                                                        ? "bg-accent text-accent-foreground font-medium"
                                                        : "text-muted-foreground hover:text-accent-foreground",
                                                    !isExpanded && "justify-center px-2"
                                                )}
                                            >
                                                <Icon className={cn(
                                                    "shrink-0 transition-colors",
                                                    isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent-foreground",
                                                    isExpanded ? "h-4 w-4" : "h-5 w-5"
                                                )} />

                                                {isExpanded && (
                                                    <span className="truncate">{t(item.name as any)}</span>
                                                )}
                                            </Link>
                                        );

                                        if (!isExpanded) {
                                            return (
                                                <Tooltip key={item.href}>
                                                    <TooltipTrigger asChild>
                                                        {linkContent}
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" sideOffset={8}>
                                                        {t(item.name as any)}
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        }

                                        return (
                                            <div key={item.href}>
                                                {linkContent}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                </div>
            </aside>
        </TooltipProvider>
    );
}
