'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar, Construction, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Control } from 'react-hook-form';
import { SettingsFormData } from '@/lib/schemas';
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from '@/components/ui/form';

interface NotificationSettingsProps {
    control: Control<SettingsFormData>;
}

export function NotificationSettings({ control }: NotificationSettingsProps) {
    return (
        <div className="space-y-6">
            {/* Lembretes de Vencimento */}
            <Card className="opacity-60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Lembretes de Vencimento
                        <Badge variant="secondary" className="ml-2 gap-1 text-xs">
                            <Construction className="h-3 w-3" />
                            Em desenvolvimento
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Configure quando você deseja ser notificado sobre contas a vencer
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="notifications.billDueDateReminderDays"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-muted-foreground">
                                        Dias de antecedência
                                    </FormLabel>
                                    <Badge variant="outline">
                                        {field.value} {field.value === 1 ? 'dia' : 'dias'}
                                    </Badge>
                                </div>
                                <FormControl>
                                    <Slider
                                        min={0}
                                        max={30}
                                        step={1}
                                        value={[field.value || 0]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        className="w-full"
                                        disabled
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    {field.value === 0
                                        ? 'Você será notificado apenas no dia do vencimento'
                                        : `Você será notificado ${field.value} ${field.value === 1 ? 'dia' : 'dias'} antes do vencimento`}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Relatórios por Email */}
            <Card className="opacity-60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Relatórios por Email
                        <Badge variant="secondary" className="ml-2 gap-1 text-xs">
                            <Construction className="h-3 w-3" />
                            Em desenvolvimento
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Receba resumos automáticos da sua atividade financeira
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="notifications.monthlyReportEmail"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base text-muted-foreground">
                                        Relatório Mensal
                                    </FormLabel>
                                    <FormDescription>
                                        Receba um resumo completo no início de cada mês
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
