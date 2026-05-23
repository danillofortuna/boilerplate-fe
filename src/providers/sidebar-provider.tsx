'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SidebarContextType {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_STORAGE_KEY = 'boilerplate-sidebar-expanded';

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(true);

    // Carrega a preferência do localStorage ao montar o componente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
            if (stored !== null) {
                setIsExpanded(stored === 'true');
            }
        }
    }, []);

    // Salva a preferência quando o estado muda
    const handleSetExpanded = (expanded: boolean) => {
        setIsExpanded(expanded);
        if (typeof window !== 'undefined') {
            localStorage.setItem(SIDEBAR_STORAGE_KEY, expanded.toString());
        }
    };

    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        if (typeof window !== 'undefined') {
            localStorage.setItem(SIDEBAR_STORAGE_KEY, newState.toString());
        }
    };

    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded: handleSetExpanded, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
