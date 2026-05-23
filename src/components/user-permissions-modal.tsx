'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { z } from 'zod';
import {
    Settings,
    Shield,
    CreditCard,
    Zap,
    BarChart3,
    Save,
    Loader2,
    AlertTriangle,
    Info,
    Crown,
    Gift,
    XCircle,
    Star
} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    useUpdateUserAccessMode,
    useUpdateUserFeatures,
    useUpdateUserLimits,
    useEnsureUserMetadata,
    useGrantLifetimePro,
    useRevokeLifetimePro
} from '@/hooks';
import { User, UserMetadata } from '@/lib/schemas';

// Schemas para os formulários
const accessModeSchema = z.object({
    accessMode: z.enum(['read_write', 'read_only', 'disabled']),
});

const featuresSchema = z.object({
    canCreateBudgets: z.boolean(),
    canExportData: z.boolean(),
    canUseReports: z.boolean(),
    canUseGoals: z.boolean(),
});

const limitsSchema = z.object({
    maxAccounts: z.number().min(1).max(100),
    maxTransactionsPerMonth: z.number().min(1).max(10000),
    maxCategoriesPerAccount: z.number().min(1).max(100),
});

interface UserPermissionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function UserPermissionsModal({
    open,
    onOpenChange,
    user
}: UserPermissionsModalProps) {
    const [activeTab, setActiveTab] = useState('access');
    const [lifetimeProReason, setLifetimeProReason] = useState('');
    const [revokeReason, setRevokeReason] = useState('');

    // Estado local para metadata que pode ser atualizado após grant/revoke
    const [localMetadata, setLocalMetadata] = useState<UserMetadata | null>(user?.metadata || null);

    // Atualizar estado local quando o user mudar (ex: ao abrir modal com outro usuário)
    useEffect(() => {
        setLocalMetadata(user?.metadata || null);
    }, [user?.metadata]);

    // Mutations
    const updateAccessMode = useUpdateUserAccessMode();
    const updateFeatures = useUpdateUserFeatures();
    const updateLimits = useUpdateUserLimits();
    const ensureMetadata = useEnsureUserMetadata();
    const grantLifetimePro = useGrantLifetimePro();
    const revokeLifetimePro = useRevokeLifetimePro();

    // Forms using Formik
    const accessFormik = useFormik({
        initialValues: {
            accessMode: user?.metadata?.accessMode?.toLowerCase() || 'read_write',
        },
        validationSchema: toFormikValidationSchema(accessModeSchema),
        enableReinitialize: true,
        onSubmit: (values) => {
            if (!user) return;
            updateAccessMode.mutate({
                userId: user.id,
                accessMode: values.accessMode,
            });
        },
    });

    const featuresFormik = useFormik({
        initialValues: {
            canCreateBudgets: user?.metadata?.canCreateBudgets ?? true,
            canExportData: user?.metadata?.canExportData ?? false,
            canUseReports: user?.metadata?.canUseReports ?? false,
            canUseGoals: user?.metadata?.canUseGoals ?? false,
        },
        validationSchema: toFormikValidationSchema(featuresSchema),
        enableReinitialize: true,
        onSubmit: (values) => {
            if (!user) return;
            updateFeatures.mutate({
                userId: user.id,
                features: values,
            });
        },
    });

    const limitsFormik = useFormik({
        initialValues: {
            maxAccounts: user?.metadata?.maxAccounts ?? 5,
            maxTransactionsPerMonth: user?.metadata?.maxTransactionsPerMonth ?? 100,
            maxCategoriesPerAccount: user?.metadata?.maxCategoriesPerAccount ?? 20,
        },
        validationSchema: toFormikValidationSchema(limitsSchema),
        enableReinitialize: true,
        onSubmit: (values) => {
            if (!user) return;
            updateLimits.mutate({
                userId: user.id,
                limits: values,
            });
        },
    });

    const handleEnsureMetadata = () => {
        if (!user) return;
        ensureMetadata.mutate(user.id);
    };

    const handleGrantLifetimePro = () => {
        if (!user) return;
        grantLifetimePro.mutate({
            userId: user.id,
            reason: lifetimeProReason || undefined
        }, {
            onSuccess: (data) => {
                setLifetimeProReason('');
                // Atualizar estado local com os dados retornados
                setLocalMetadata(prev => prev ? ({
                    ...prev,
                    isLifetimePro: data.isLifetimePro ?? true,
                    proSource: data.proSource ?? 'ADMIN_GRANTED',
                    planType: data.planType ?? 'PRO',
                }) : null);
            }
        });
    };

    const handleRevokeLifetimePro = () => {
        if (!user) return;
        revokeLifetimePro.mutate({
            userId: user.id,
            reason: revokeReason || undefined
        }, {
            onSuccess: (data) => {
                setRevokeReason('');
                // Atualizar estado local com os dados retornados
                setLocalMetadata(prev => prev ? ({
                    ...prev,
                    isLifetimePro: data.isLifetimePro ?? false,
                    proSource: data.proSource ?? null,
                    planType: data.planType ?? 'FREE',
                }) : null);
            }
        });
    };

    const getAccessModeInfo = (mode: string) => {
        const lowerMode = mode.toLowerCase();
        switch (lowerMode) {
            case 'read_write':
                return { label: 'Leitura e Escrita', color: 'default', desc: 'Acesso completo ao sistema' };
            case 'read_only':
                return { label: 'Apenas Leitura', color: 'secondary', desc: 'Pode visualizar mas não modificar dados' };
            case 'disabled':
                return { label: 'Desabilitado', color: 'destructive', desc: 'Acesso bloqueado ao sistema' };
            default:
                return { label: mode, color: 'secondary', desc: 'Modo desconhecido' };
        }
    };

    const getPlanInfo = (plan: string) => {
        switch (plan) {
            case 'FREE':
                return { label: 'Gratuito', color: 'secondary', desc: 'Funcionalidades básicas' };
            case 'PRO':
                return { label: 'Profissional', color: 'default', desc: 'Funcionalidades avançadas' };
            case 'ENTERPRISE':
                return { label: 'Empresarial', color: 'default', desc: 'Funcionalidades completas' };
            default:
                return { label: plan, color: 'secondary', desc: 'Plano desconhecido' };
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[45vw] lg:max-w-[42vw] xl:max-w-[660px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Gerenciar Permissões - {user.name}
                    </DialogTitle>
                    <DialogDescription>
                        Configure modo de acesso, plano, funcionalidades e limites do usuário
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="access">Acesso</TabsTrigger>
                            <TabsTrigger value="plan">Plano</TabsTrigger>
                            <TabsTrigger value="lifetime">
                                <Star className="h-4 w-4 mr-1" />
                                Vitalício
                            </TabsTrigger>
                            <TabsTrigger value="features">Funcionalidades</TabsTrigger>
                            <TabsTrigger value="limits">Limites</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 overflow-auto space-y-4 pt-4">
                            <TabsContent value="access" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            Modo de Acesso
                                        </CardTitle>
                                        <CardDescription>
                                            Controle o nível de acesso do usuário ao sistema
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-medium">Status atual:</span>
                                                <Badge variant={getAccessModeInfo(user.metadata?.accessMode || 'READ_WRITE').color as any}>
                                                    {getAccessModeInfo(user.metadata?.accessMode || 'READ_WRITE').label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {getAccessModeInfo(user.metadata?.accessMode || 'READ_WRITE').desc}
                                            </p>
                                        </div>

                                        <form onSubmit={accessFormik.handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Novo modo de acesso</Label>
                                                <Select
                                                    onValueChange={(value) => accessFormik.setFieldValue('accessMode', value)}
                                                    value={accessFormik.values.accessMode}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o modo de acesso" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="read_write">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                                Leitura e Escrita
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="read_only">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                                                                Apenas Leitura
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="disabled">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                                                Desabilitado
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {accessFormik.touched.accessMode && accessFormik.errors.accessMode && (
                                                    <p className="text-sm text-red-600">{accessFormik.errors.accessMode}</p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={updateAccessMode.isPending}
                                                className="w-full"
                                            >
                                                {updateAccessMode.isPending ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                Atualizar Modo de Acesso
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="features" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Zap className="h-4 w-4" />
                                            Funcionalidades
                                        </CardTitle>
                                        <CardDescription>
                                            Controle quais funcionalidades o usuário pode usar
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {!localMetadata ? (
                                            <Button
                                                onClick={handleEnsureMetadata}
                                                disabled={ensureMetadata.isPending}
                                                variant="outline"
                                                className="w-full mb-4"
                                            >
                                                {ensureMetadata.isPending ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Settings className="h-4 w-4 mr-2" />
                                                )}
                                                Garantir Metadata do Usuário
                                            </Button>
                                        ) : null}

                                        <form onSubmit={featuresFormik.handleSubmit} className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label>Criar Orçamentos</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Permite criar e gerenciar orçamentos
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={featuresFormik.values.canCreateBudgets}
                                                    onCheckedChange={(checked) => featuresFormik.setFieldValue('canCreateBudgets', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label>Exportar Dados</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Permite exportar dados em diversos formatos
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={featuresFormik.values.canExportData}
                                                    onCheckedChange={(checked) => featuresFormik.setFieldValue('canExportData', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label>Usar Relatórios</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Permite gerar e visualizar relatórios
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={featuresFormik.values.canUseReports}
                                                    onCheckedChange={(checked) => featuresFormik.setFieldValue('canUseReports', checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label>Usar Metas</Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        Permite criar e gerenciar metas financeiras
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={featuresFormik.values.canUseGoals}
                                                    onCheckedChange={(checked) => featuresFormik.setFieldValue('canUseGoals', checked)}
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={updateFeatures.isPending}
                                                className="w-full"
                                            >
                                                {updateFeatures.isPending ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                Atualizar Funcionalidades
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="limits" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4" />
                                            Limites do Usuário
                                        </CardTitle>
                                        <CardDescription>
                                            Configure limites de uso para o usuário
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={limitsFormik.handleSubmit} className="space-y-4">
                                            <Field
                                                label="Máximo de Contas"
                                                name="maxAccounts"
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={limitsFormik.values.maxAccounts}
                                                onChange={(e) => limitsFormik.setFieldValue('maxAccounts', Number(e.target.value))}
                                                onBlur={limitsFormik.handleBlur}
                                                error={limitsFormik.errors.maxAccounts}
                                                touched={limitsFormik.touched.maxAccounts}
                                            />

                                            <Field
                                                label="Transações por Mês"
                                                name="maxTransactionsPerMonth"
                                                type="number"
                                                min="1"
                                                max="10000"
                                                value={limitsFormik.values.maxTransactionsPerMonth}
                                                onChange={(e) => limitsFormik.setFieldValue('maxTransactionsPerMonth', Number(e.target.value))}
                                                onBlur={limitsFormik.handleBlur}
                                                error={limitsFormik.errors.maxTransactionsPerMonth}
                                                touched={limitsFormik.touched.maxTransactionsPerMonth}
                                            />

                                            <Field
                                                label="Categorias por Conta"
                                                name="maxCategoriesPerAccount"
                                                type="number"
                                                min="1"
                                                max="100"
                                                value={limitsFormik.values.maxCategoriesPerAccount}
                                                onChange={(e) => limitsFormik.setFieldValue('maxCategoriesPerAccount', Number(e.target.value))}
                                                onBlur={limitsFormik.handleBlur}
                                                error={limitsFormik.errors.maxCategoriesPerAccount}
                                                touched={limitsFormik.touched.maxCategoriesPerAccount}
                                            />

                                            <Button
                                                type="submit"
                                                disabled={updateLimits.isPending}
                                                className="w-full"
                                            >
                                                {updateLimits.isPending ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4 mr-2" />
                                                )}
                                                Atualizar Limites
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="plan" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Plano do Usuário
                                        </CardTitle>
                                        <CardDescription>
                                            Informações sobre o plano atual do usuário
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Plano atual */}
                                        <div className="p-4 border rounded-lg bg-muted/50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Plano</span>
                                                <Badge variant={getPlanInfo(localMetadata?.planType || 'FREE').color as any}>
                                                    {getPlanInfo(localMetadata?.planType || 'FREE').label}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Origem do plano */}
                                        <div className="p-4 border rounded-lg bg-muted/50">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Origem</span>
                                                <Badge variant="outline">
                                                    {localMetadata?.proSource === 'TRIAL' && '🎁 Trial'}
                                                    {localMetadata?.proSource === 'SUBSCRIPTION' && '💳 Assinatura Stripe'}
                                                    {localMetadata?.proSource === 'ADMIN_GRANTED' && '⭐ Concedido por Admin'}
                                                    {!localMetadata?.proSource && '—'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="lifetime" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            PRO Vitalício
                                        </CardTitle>
                                        <CardDescription>
                                            Conceda ou revogue acesso PRO vitalício para amigos, parceiros ou casos especiais
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Status atual */}
                                        <div className="p-4 border rounded-lg bg-muted/50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">Status Atual</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {localMetadata?.isLifetimePro ? (
                                                            <>
                                                                <Badge className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-100">
                                                                    <Crown className="h-3 w-3 mr-1" />
                                                                    PRO Vitalício
                                                                </Badge>
                                                                <span className="text-sm text-muted-foreground">
                                                                    (concedido por admin)
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <Badge variant="outline" className="text-muted-foreground">
                                                                Não possui PRO vitalício
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Seção de Conceder PRO Vitalício */}
                                        {!localMetadata?.isLifetimePro && (
                                            <div className="space-y-4 p-4 border rounded-lg border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                                                <div className="flex items-center gap-2">
                                                    <Gift className="h-5 w-5 text-green-600" />
                                                    <h4 className="font-medium text-green-800 dark:text-green-200">Conceder PRO Vitalício</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="grantReason">Motivo (opcional)</Label>
                                                    <Textarea
                                                        id="grantReason"
                                                        placeholder="Ex: Amigo do fundador, parceiro de negócios, beta tester..."
                                                        value={lifetimeProReason}
                                                        onChange={(e) => setLifetimeProReason(e.target.value)}
                                                        rows={2}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={handleGrantLifetimePro}
                                                    disabled={grantLifetimePro.isPending}
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                >
                                                    {grantLifetimePro.isPending ? (
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Crown className="h-4 w-4 mr-2" />
                                                    )}
                                                    Conceder PRO Vitalício
                                                </Button>
                                            </div>
                                        )}

                                        {/* Seção de Revogar PRO Vitalício */}
                                        {localMetadata?.isLifetimePro && (
                                            <div className="space-y-4 p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                    <h4 className="font-medium text-red-800 dark:text-red-200">Revogar PRO Vitalício</h4>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="revokeReason">Motivo (opcional)</Label>
                                                    <Textarea
                                                        id="revokeReason"
                                                        placeholder="Ex: Solicitação do usuário, violação de termos..."
                                                        value={revokeReason}
                                                        onChange={(e) => setRevokeReason(e.target.value)}
                                                        rows={2}
                                                    />
                                                </div>
                                                <Button
                                                    onClick={handleRevokeLifetimePro}
                                                    disabled={revokeLifetimePro.isPending}
                                                    variant="destructive"
                                                    className="w-full"
                                                >
                                                    {revokeLifetimePro.isPending ? (
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                    )}
                                                    Revogar PRO Vitalício
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
