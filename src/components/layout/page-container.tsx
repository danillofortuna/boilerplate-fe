import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    scrollable?: boolean;
}

export function PageContainer({
    children,
    className,
    scrollable = false,
    ...props
}: PageContainerProps) {
    return (
        <div
            className={cn(
                'flex flex-col h-full w-full',
                scrollable ? 'overflow-auto' : 'overflow-hidden',
                className
            )}
            {...props}
        >
            <div className={cn('flex-1 space-y-4 p-4 md:p-8 pt-6', className)}>
                {children}
            </div>
        </div>
    );
}
