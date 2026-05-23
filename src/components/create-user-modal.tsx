'use client';

import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { UserPlus, Shield, ShieldCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@/hooks/users/use-create-user';
import { CreateUserRequestSchema, CreateUserRequest } from '@/lib/schemas';

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Helper para campo de formulário simples (já que Field não existe no Boilerplate ainda, ou se existe vou usar Input direto para garantir)
const FormField = ({ label, error, ...props }: any) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Input {...props} />
        {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
);

export function CreateUserModal({ open, onOpenChange }: CreateUserModalProps) {
    const formik = useFormik<CreateUserRequest>({
        initialValues: {
            name: '',
            login: '',
            email: '',
            password: '',
            admin: false,
            active: true,
        },
        validationSchema: toFormikValidationSchema(CreateUserRequestSchema),
        onSubmit: (values) => {
            createUser(values);
        },
    });

    const { mutate: createUser, isPending } = useCreateUser(
        () => {
            onOpenChange(false);
            formik.resetForm();
        }
    );

    // Reset form when modal closes
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            formik.resetForm();
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Novo Usuário</DialogTitle>
                    </div>
                    <DialogDescription className="text-base">
                        Cadastre um novo usuário no sistema
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
                    {/* Nome Completo */}
                    <FormField
                        label="Nome Completo"
                        name="name"
                        placeholder="Ex: João Silva Santos"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name ? formik.errors.name : undefined}
                    />

                    {/* Login */}
                    <FormField
                        label="Login de Acesso"
                        name="login"
                        placeholder="Ex: joao.silva"
                        value={formik.values.login}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.login ? formik.errors.login : undefined}
                    />

                    {/* Email */}
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Ex: joao.silva@empresa.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email ? formik.errors.email : undefined}
                    />

                    {/* Senha */}
                    <div className="space-y-2">
                        <FormField
                            label="Senha Inicial"
                            name="password"
                            type="password"
                            placeholder="Digite uma senha segura"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password ? formik.errors.password : undefined}
                        />
                        <p className="text-xs text-muted-foreground">
                            O usuário poderá alterar a senha no primeiro acesso
                        </p>
                    </div>

                    {/* Permissões */}
                    <div className="space-y-4 p-4 rounded-lg border bg-muted/20">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm font-medium">Permissões do Usuário</Label>
                        </div>

                        <div className="space-y-3">
                            {/* Usuário Ativo */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="active"
                                    checked={formik.values.active}
                                    onCheckedChange={(checked) =>
                                        formik.setFieldValue('active', checked === true)
                                    }
                                />
                                <Label
                                    htmlFor="active"
                                    className="text-sm font-medium leading-none cursor-pointer"
                                >
                                    Usuário ativo
                                </Label>
                            </div>

                            {/* Administrador */}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="admin"
                                    checked={formik.values.admin}
                                    onCheckedChange={(checked) =>
                                        formik.setFieldValue('admin', checked === true)
                                    }
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label
                                        htmlFor="admin"
                                        className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1"
                                    >
                                        <ShieldCheck className="h-3 w-3" />
                                        Administrador do sistema
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Poderá gerenciar usuários e configurações avançadas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            className="flex-1"
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>Criando...</>
                            ) : (
                                <>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Criar Usuário
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
