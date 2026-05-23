'use client';

import { useEffect } from 'react';
import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Edit2, Shield, ShieldCheck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUpdateUser } from '@/hooks/users/use-update-user';
import { updateUserSchema, UpdateUserRequest, User } from '@/lib/schemas';

interface EditUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
}

export function EditUserModal({ open, onOpenChange, user }: EditUserModalProps) {
    const formik = useFormik<UpdateUserRequest>({
        initialValues: {
            id: 0,
            name: '',
            login: '',
            email: '',
            admin: false,
            active: true,
        },
        validationSchema: toFormikValidationSchema(updateUserSchema),
        onSubmit: (values) => {
            updateUser(values);
        },
    });

    const { mutate: updateUser, isPending } = useUpdateUser(
        () => {
            onOpenChange(false);
            formik.resetForm();
        }
    );

    // Preenche o formulário quando o usuário muda
    useEffect(() => {
        if (user) {
            formik.setValues({
                id: user.id,
                name: user.name,
                login: user.login,
                email: user.email,
                admin: user.admin,
                active: user.active,
            });
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // Reset form when modal closes
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            formik.resetForm();
        }
        onOpenChange(newOpen);
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Edit2 className="h-6 w-6 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Editar Usuário</DialogTitle>
                    </div>
                    <DialogDescription className="text-base">
                        Atualize as informações de <strong>{user.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={formik.handleSubmit} className="space-y-6 mt-6">
                    {/* Nome Completo */}
                    <Field
                        label="Nome Completo"
                        name="name"
                        placeholder="Ex: João Silva Santos"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name ? formik.errors.name : undefined}
                    />

                    {/* Login */}
                    <Field
                        label="Login de Acesso"
                        name="login"
                        placeholder="Ex: joao.silva"
                        value={formik.values.login}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.login ? formik.errors.login : undefined}
                    />

                    {/* Email */}
                    <Field
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Ex: joao.silva@empresa.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email ? formik.errors.email : undefined}
                    />

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
                                <>Salvando...</>
                            ) : (
                                <>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
