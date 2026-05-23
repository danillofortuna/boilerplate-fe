'use client';
import { Suspense } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { SidebarProvider, useSidebar } from '@/providers/sidebar-provider';

function AuthenticatedContent({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar();

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 relative overflow-hidden">
                <Suspense fallback={null}>
                    <Sidebar />
                </Suspense>
                {/* Espaçador invisível para desktop */}
                <div
                    className="hidden md:block shrink-0 transition-all duration-300"
                    style={{ width: isExpanded ? '256px' : '64px' }}
                />
                {/* Conteúdo principal */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AuthenticatedContent>{children}</AuthenticatedContent>
        </SidebarProvider>
    );
}
