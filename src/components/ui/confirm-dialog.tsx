'use client';

import React, { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Timer, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    type?: 'alert' | 'delete';
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    showCountdown?: boolean;
    loading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    onConfirm,
    type = 'alert',
    title,
    description,
    confirmText,
    cancelText = 'Cancelar',
    showCountdown = false,
    loading = false,
}: ConfirmDialogProps) {
    const [countdown, setCountdown] = useState<number>(0);
    const isDelete = type === 'delete';
    const shouldShowCountdown = isDelete && showCountdown;

    // Reset countdown quando abre
    useEffect(() => {
        if (open && shouldShowCountdown) {
            setCountdown(3);
        } else {
            setCountdown(0);
        }
    }, [open, shouldShowCountdown]);

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleConfirm = () => {
        if (!shouldShowCountdown || countdown === 0) {
            onConfirm();
        }
    };

    const Icon = isDelete ? Trash2 : Info;
    const iconColor = isDelete ? 'text-destructive' : 'text-primary';
    const buttonVariant = isDelete ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90';
    const defaultConfirmText = isDelete ? 'Excluir' : 'Confirmar';

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col items-center text-center">
                    {/* Ícone principal */}
                    <div className="relative mb-4">
                        <div className={cn(
                            "rounded-full p-3",
                            isDelete ? "bg-destructive/10" : "bg-primary/10"
                        )}>
                            <Icon className={cn("h-6 w-6", iconColor)} />
                        </div>

                        {/* Countdown visual apenas para delete */}
                        {isDelete && countdown > 0 && (
                            <div className="absolute -inset-4 flex items-center justify-center">
                                <div className="text-3xl font-bold text-destructive/30 animate-pulse">
                                    {countdown}
                                </div>
                            </div>
                        )}
                    </div>

                    <AlertDialogHeader className="space-y-2">
                        <AlertDialogTitle className="text-xl">
                            {title}
                        </AlertDialogTitle>
                        {description && (
                            <AlertDialogDescription className="text-base">
                                {description}
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                </div>

                <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel disabled={loading}>
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={(shouldShowCountdown && countdown > 0) || loading}
                        className={cn(
                            "relative text-white transition-all",
                            buttonVariant,
                            shouldShowCountdown && countdown > 0 && "bg-muted hover:bg-muted cursor-not-allowed",
                            loading && "cursor-wait"
                        )}
                    >
                        {/* Barra de progresso do countdown */}
                        {shouldShowCountdown && countdown > 0 && (
                            <div
                                className="absolute inset-0 bg-destructive/30 rounded-md transition-all duration-1000"
                                style={{
                                    width: `${(3 - countdown) * 33.33}%`,
                                }}
                            />
                        )}

                        <span className="relative flex items-center justify-center">
                            {loading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                                    <span>Processando...</span>
                                </>
                            ) : countdown > 0 ? (
                                <>
                                    <Timer className="mr-2 h-4 w-4" />
                                    <span>Aguarde {countdown}s</span>
                                </>
                            ) : (
                                <>
                                    {isDelete && <Trash2 className="mr-2 h-4 w-4" />}
                                    <span>{confirmText || defaultConfirmText}</span>
                                </>
                            )}
                        </span>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
