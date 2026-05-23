'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, FolderOpen, Calendar, Sparkles, TrendingUp, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Control } from 'react-hook-form';
import { SettingsFormData } from '@/lib/schemas';
import { FormField, FormItem, FormControl, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import * as Icons from 'lucide-react';

// Mock simple hooks since dynamic data is secondary for this task's scope, 
// OR simpler: we can just use empty arrays/loading states as per "boilerplate" nature
// But to match visuals we need some fake options or keep it loading/empty.
// For now I will inline the "hooks" logic or simpler: assume data is empty or mocking it.

// Recriando a função auxiliar para ícones
const renderCategoryIcon = (iconName?: string, className = "h-4 w-4") => {
    if (!iconName) return <Icons.Tag className={className} />;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    const Icon = content;
    return Icon ? <Icon className={className} /> : <Icons.Tag className={className} />;
};

interface BusinessPreferencesSettingsProps {
    control: Control<SettingsFormData>;
    // Opcional: passar dados de contas/categorias como props se decidir carregar no pai
    // Por enquanto vamos assumir "loading" ou vazio para simplificar, já que não temos os hooks de accounts/categories prontos no boilerplate
}

export function BusinessPreferencesSettings({ control }: BusinessPreferencesSettingsProps) {
    // Mock loading states (since we don't have the hooks imported yet)
    const loadingAccounts = false;
    const loadingCategories = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accounts: any[] = []; // TODO: Implementar hooks de contas
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allCategories: any[] = []; // TODO: Implementar hooks de categorias

    return (
        <div className="space-y-6">
            {/* Conta Padrão */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Conta Padrão
                    </CardTitle>
                    <CardDescription>
                        Conta pré-selecionada ao criar novas transações
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="preferences.defaultAccountId"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Conta padrão</FormLabel>
                                <Select
                                    disabled={loadingAccounts}
                                    onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                    value={field.value?.toString() || 'none'}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingAccounts ? "Carregando..." : "Nenhuma"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            <span className="text-muted-foreground">Nenhuma (sempre perguntar)</span>
                                        </SelectItem>
                                        {accounts?.map((account) => (
                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <span>{account.description}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {account.accountType}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Categoria Padrão */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        Categoria Padrão para Despesas
                    </CardTitle>
                    <CardDescription>
                        Categoria pré-selecionada ao criar despesas
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="preferences.defaultExpenseCategoryId"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Categoria padrão</FormLabel>
                                <Select
                                    disabled={loadingCategories}
                                    onValueChange={(val) => field.onChange(val === 'none' ? null : Number(val))}
                                    value={field.value?.toString() || 'none'}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingCategories ? "Carregando..." : "Nenhuma"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            <span className="text-muted-foreground">Nenhuma (sempre perguntar)</span>
                                        </SelectItem>
                                        {allCategories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="flex h-5 w-5 items-center justify-center rounded"
                                                        style={{
                                                            backgroundColor: category.color ? category.color + '20' : undefined,
                                                            color: category.color
                                                        }}
                                                    >
                                                        {renderCategoryIcon(category.icon, "h-3.5 w-3.5")}
                                                    </div>
                                                    <span>{category.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Lembretes de Transações Recorrentes */}
            <Card className="opacity-60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Lembretes de Recorrentes
                        <Badge variant="secondary" className="text-xs ml-2">
                            <Lock className="h-3 w-3 mr-1" />
                            Em desenvolvimento
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Dias de antecedência para lembretes de transações recorrentes
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="preferences.recurringReminderDays"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Dias de antecedência</FormLabel>
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
                                        onValueChange={(val) => field.onChange(val[0])}
                                        className="w-full"
                                        disabled
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    {field.value === 0
                                        ? 'Sem lembretes antecipados'
                                        : `Ser notificado ${field.value} ${field.value === 1 ? 'dia' : 'dias'} antes`}
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Auto-categorização */}
            <Card className="opacity-60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Auto-categorização
                        <Badge variant="secondary" className="text-xs ml-2">
                            <Lock className="h-3 w-3 mr-1" />
                            Em desenvolvimento
                        </Badge>
                    </CardTitle>
                    <CardDescription>
                        Categorizar automaticamente transações com base no histórico
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="preferences.autoCategorizationEnabled"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                                <div className="space-y-0.5">
                                    <FormLabel>Ativar auto-categorização</FormLabel>
                                    <FormDescription>
                                        O sistema sugere categorias baseado em transações similares
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

            {/* Projeção de Valores Variáveis */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Projeção de Valores Variáveis
                    </CardTitle>
                    <CardDescription>
                        Como calcular valores pendentes de transações variáveis
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                        control={control}
                        name="preferences.useAverageForVariablePending"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <FormLabel>Usar Média Histórica</FormLabel>
                                        <FormDescription>
                                            Calcula valores pendentes baseado na média dos últimos 12 meses
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </div>
                                <div className="mt-4">
                                    {field.value && (
                                        <div className="rounded-lg bg-green-500/10 p-3">
                                            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Projeções mais realistas ativadas - Dashboard usará médias históricas
                                            </p>
                                        </div>
                                    )}
                                    {!field.value && (
                                        <div className="rounded-lg bg-muted/50 p-3">
                                            <p className="text-xs text-muted-foreground">
                                                Valores fixos serão usados para transações variáveis pendentes
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
