'use client';

import {
    Shield,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Ban,
    Clock,
    AlertCircle
} from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserSecurityInfo } from '@/hooks';
import { User } from '@/lib/schemas';

interface UserSecurityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onManagePermissions?: (user: User) => void;
}

export function UserSecurityModal({
    open,
    onOpenChange,
    user,
    onManagePermissions
}: UserSecurityModalProps) {
    const { data: securityInfo, isLoading } = useUserSecurityInfo(
        user?.id || 0,
        open && !!user
    );

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Informações de Segurança - {user.name}
                    </DialogTitle>
                    <DialogDescription>
                        Visualize histórico de segurança do usuário
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Carregando informações de segurança...</span>
                    </div>
                ) : securityInfo ? (
                    <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                        <TabsList className="grid w-full grid-cols-2 my-4">
                            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                            <TabsTrigger value="activities">Atividades Recenters</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Status de Reputação</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-green-100 text-green-800">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Boa Reputação
                                            </Badge>
                                            <span className="text-2xl font-bold">
                                                {securityInfo.suspiciousActivityCount}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Última Verificação</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                                {securityInfo.lastSecurityCheck
                                                    ? new Date(securityInfo.lastSecurityCheck).toLocaleString()
                                                    : 'Nunca verificado'
                                                }
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="activities" className="space-y-4">
                            <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                <p className="text-muted-foreground">
                                    Nenhuma atividade suspeita nas últimas 24 horas
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <p className="text-muted-foreground">
                            Erro ao carregar informações de segurança
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
