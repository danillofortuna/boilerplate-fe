'use client';

import { useMySubscription } from '@/hooks/use-my-subscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, ExternalLink, Loader2, Calendar, CreditCard } from 'lucide-react';

export function SubscriptionSettings() {
    const { data: subscription, isLoading } = useMySubscription();

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {subscription ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/10 rounded-full">
                                    <Crown className="h-6 w-6 text-yellow-500" />
                                </div>
                                <div className="space-y-1 text-center sm:text-left">
                                    <h3 className="font-semibold text-lg flex items-center justify-center sm:justify-start gap-2">
                                        Plano {subscription.planType}
                                        <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'destructive'} className="text-xs">
                                            {subscription.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </h3>
                                    {subscription.currentPeriodEnd && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
                                            <Calendar className="h-3 w-3" />
                                            Expira em: {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => window.location.href = '/subscription?tab=plans'}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ver Planos
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <div className="p-4 bg-muted rounded-full">
                                <Crown className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Sem Assinatura Ativa</h3>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Faça upgrade para desbloquear recursos premium como limites maiores e relatórios avançados.
                                </p>
                            </div>
                            <Button onClick={() => window.location.href = '/subscription?tab=plans'}>
                                Ver Planos
                            </Button>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Placeholder for Plan Features if needed, mimicking reference simplicity for now */}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
