'use client';

import { forwardRef, useRef, useImperativeHandle } from 'react';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-react';
import 'overlayscrollbars/overlayscrollbars.css';
import { cn } from '@/lib/utils';

interface CustomScrollbarProps {
    children: React.ReactNode;
    className?: string;
    maxHeight?: string;
    style?: React.CSSProperties;
}

export const CustomScrollbar = forwardRef<HTMLDivElement, CustomScrollbarProps>(
    ({ children, className, maxHeight, style }, ref) => {
        const overlayRef = useRef<OverlayScrollbarsComponentRef<'div'>>(null);

        useImperativeHandle(ref, () => {
            const instance = overlayRef.current?.osInstance();
            const elements = instance?.elements();
            return elements?.viewport as HTMLDivElement;
        }, []);

        return (
            <OverlayScrollbarsComponent
                ref={overlayRef}
                className={cn('custom-scrollbar', className)}
                style={{ maxHeight, ...style }}
                options={{
                    scrollbars: {
                        theme: 'os-theme-dark os-theme-light',
                        visibility: 'auto',
                        autoHide: 'move',
                        autoHideDelay: 1000,
                        clickScroll: true,
                    },
                    overflow: {
                        x: 'hidden',
                        y: 'scroll',
                    },
                }}
            >
                {children}
            </OverlayScrollbarsComponent>
        );
    }
);

CustomScrollbar.displayName = 'CustomScrollbar';
