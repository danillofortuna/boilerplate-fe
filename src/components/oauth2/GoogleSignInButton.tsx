'use client';

import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { cn } from '@/lib/utils';
import { initiateOAuth2Login } from '@/hooks/auth/use-oauth2';

interface GoogleSignInButtonProps {
    className?: string;
    disabled?: boolean;
    text?: string;
}

export function GoogleSignInButton({
    className,
    disabled = false,
    text = "Continuar com Google"
}: GoogleSignInButtonProps) {
    const handleClick = () => {
        console.log('🔥 GoogleSignInButton clicado!');

        if (!disabled) {
            initiateOAuth2Login('google');
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                // Base styles seguindo o padrão oficial do Google
                "relative inline-flex items-center justify-center w-full h-10 px-4 py-2",
                "bg-white border border-gray-300 rounded-md shadow-sm",
                "text-gray-700 font-medium text-sm",
                "transition-all duration-200 ease-in-out",

                // Hover states
                "hover:bg-gray-50 hover:border-gray-400 hover:shadow-md",

                // Focus states (use focus-visible to avoid ring on click)
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",

                // Active state
                "active:bg-gray-100 active:shadow-inner",

                // Disabled state
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:shadow-sm",

                // Dark mode support
                "dark:bg-white dark:border-gray-300 dark:text-gray-700",
                "dark:hover:bg-gray-50 dark:hover:border-gray-400",

                className
            )}
        >
            <div className="flex items-center justify-center gap-3">
                <GoogleIcon size={18} />
                <span className="font-medium">{text}</span>
            </div>
        </button>
    );
}
