import * as React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface PasswordFieldProps extends Omit<React.ComponentProps<typeof Input>, 'type'> {
    label?: string;
    name: string;
    error?: string;
    touched?: boolean;
    showError?: boolean;
    required?: boolean;
    submitCount?: number;
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
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
        const [showPassword, setShowPassword] = React.useState(false);

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
                {label && (
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
                )}
                <div className="relative">
                    <Input
                        ref={ref}
                        id={name}
                        name={name}
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            'h-12 pr-12',
                            className,
                            hasError && [
                                "!border-destructive",
                                "!ring-destructive/20",
                                "focus-visible:!ring-destructive/20",
                                "focus-visible:!border-destructive"
                            ]
                        )}
                        aria-invalid={hasError ? 'true' : 'false'}
                        aria-describedby={hasError ? `${name}-error` : undefined}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        {...props}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors hover:opacity-70"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                    </button>
                </div>
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

PasswordField.displayName = 'PasswordField';

export { PasswordField };
