'use client';

import { GoogleSignInButton } from './GoogleSignInButton';

interface OAuth2LoginSectionProps {
    className?: string;
    providers?: string[];
}

export function OAuth2LoginSection({
    className = '',
    providers = ['google']
}: OAuth2LoginSectionProps) {
    return (
        <div className={className}>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Ou continue com
                    </span>
                </div>
            </div>

            <div className="grid gap-3 mt-4">
                {providers.map((provider) => (
                    provider === 'google' ? (
                        <GoogleSignInButton key={provider} className="w-full" />
                    ) : null
                ))}
            </div>
        </div>
    );
}
