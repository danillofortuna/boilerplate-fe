'use client';

import { cn } from '@/lib/utils';

interface EmptyStateIllustrationProps {
    title?: string;
    description?: string;
    className?: string;
    variant?: 'search' | 'empty' | 'error';
}

export function EmptyStateIllustration({
    title = "Nenhum resultado encontrado",
    description = "Tente ajustar os filtros ou realizar uma nova busca.",
    variant = 'search',
    className
}: EmptyStateIllustrationProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-12 px-4",
            className
        )}>
            {/* Ilustração SVG */}
            <div className="w-24 h-24 mb-6">
                {variant === 'search' && (
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="80" cy="80" r="50" stroke="currentColor" strokeWidth="4" className="text-muted-foreground/30" />
                        <path d="M115 115L145 145" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-muted-foreground/30" />
                        <rect x="60" y="60" width="40" height="50" rx="4" fill="currentColor" className="text-muted/50" />
                        <line x1="70" y1="75" x2="90" y2="75" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" />
                        <line x1="70" y1="85" x2="85" y2="85" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" />
                        <line x1="70" y1="95" x2="88" y2="95" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" />
                        <circle cx="150" cy="50" r="3" fill="currentColor" className="text-muted-foreground/20" />
                        <circle cx="50" cy="150" r="2" fill="currentColor" className="text-muted-foreground/20" />
                        <circle cx="170" cy="120" r="2.5" fill="currentColor" className="text-muted-foreground/20" />
                    </svg>
                )}

                {variant === 'empty' && (
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 80 L40 140 Q40 150 50 150 L150 150 Q160 150 160 140 L160 70 Q160 60 150 60 L90 60 L80 50 Q75 45 70 45 L50 45 Q40 45 40 55 Z"
                            fill="currentColor" className="text-muted/50" />
                        <path d="M40 80 Q40 70 50 70 L150 70 Q160 70 160 80"
                            stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30" />
                        <circle cx="80" cy="105" r="3" fill="currentColor" className="text-muted-foreground/40" />
                        <circle cx="120" cy="105" r="3" fill="currentColor" className="text-muted-foreground/40" />
                        <path d="M85 125 Q100 115 115 125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted-foreground/40" />
                    </svg>
                )}
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
                {title}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
                {description}
            </p>
        </div>
    );
}
