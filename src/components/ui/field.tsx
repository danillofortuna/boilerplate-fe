import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface FieldProps extends React.ComponentProps<typeof Input> {
    label: string;
    name: string;
    error?: string;
    touched?: boolean;
    showError?: boolean;
    required?: boolean;
    submitCount?: number;
}

const Field = React.forwardRef<HTMLInputElement, FieldProps>(
    ({
        label,
        name,
        error,
        touched,
        showError = true,
        required = false,
        submitCount = 0,
        className,
        onChange,
        onFocus,
        ...props
    }, ref) => {
        // Estado para controlar se devemos esconder o erro quando o usuário começar a digitar
        const [hideErrorOnChange, setHideErrorOnChange] = React.useState(false);

        // Reset do estado quando submitCount muda (novo submit)
        React.useEffect(() => {
            setHideErrorOnChange(false);
        }, [submitCount]);

        // Mostra erro se: foi submetido E há erro E não foi escondido pelo usuário
        const shouldShowError = showError && error && submitCount > 0 && !hideErrorOnChange;
        const hasError = Boolean(shouldShowError);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Se há erro e o usuário começou a digitar, esconde o erro
            if (error && submitCount > 0) {
                setHideErrorOnChange(true);
            }
            onChange?.(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            // Se há erro e o usuário focou no campo, esconde o erro
            if (error && submitCount > 0) {
                setHideErrorOnChange(true);
            }
            onFocus?.(e);
        };

        return (
            <div className="space-y-2">
                <label
                    htmlFor={name}
                    className={cn(
                        "text-sm font-medium transition-colors",
                        hasError ? "text-destructive" : "text-foreground",
                        required && "after:content-['*'] after:ml-1 after:text-destructive"
                    )}
                >
                    {label}
                </label>
                <Input
                    ref={ref}
                    id={name}
                    name={name}
                    className={cn(
                        "h-12",
                        className,
                        hasError && [
                            "ring-2",
                            "ring-destructive",
                            "border-destructive"
                        ]
                    )}
                    aria-invalid={hasError ? 'true' : 'false'}
                    aria-describedby={hasError ? `${name}-error` : undefined}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    {...props}
                />
                {shouldShowError && (
                    <div
                        id={`${name}-error`}
                        className="flex items-center gap-1 text-sm text-destructive"
                        role="alert"
                    >
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

Field.displayName = 'Field';

export { Field };
