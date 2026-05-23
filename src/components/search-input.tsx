'use client';

import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchInputProps extends React.ComponentProps<typeof Input> {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    showClearButton?: boolean;
    containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({
        value,
        onValueChange,
        placeholder = "Pesquisar...",
        showClearButton = true,
        containerClassName,
        className,
        ...props
    }, ref) => {
        const handleClear = () => {
            onValueChange('');
        };

        return (
            <div className={cn("relative", containerClassName)}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    ref={ref}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    className={cn("pl-9", showClearButton && value && "pr-9", className)}
                    {...props}
                />
                {showClearButton && value && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Limpar pesquisa</span>
                    </Button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput";
