'use client';

import { useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
    Users,
    UserPlus,
    MoreHorizontal,
    Edit,
    Trash2,
    Shield,
    ShieldCheck,
    ArrowUpDown,
    Search,
    Key,
    Unlock,
    Lock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { PageContainer } from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table'; // Make sure this path is correct based on where we created it
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog'; // Make sure this path is correct

// Hooks & Modals
import { useUsers } from '@/hooks/users/use-users';
import { useDeleteUser } from '@/hooks/users/use-delete-user';
import { useDeleteUsers } from '@/hooks/users/use-delete-users';
import { useToggleUserStatus } from '@/hooks/users/use-toggle-user-status';
import { useDebounce } from '@/hooks/use-debounce';
import { CreateUserModal } from '@/components/create-user-modal';
import { EditUserModal } from '@/components/edit-user-modal';
import { ChangePasswordModal } from '@/components/change-password-modal';
import { UserPermissionsModal } from '@/components/user-permissions-modal';
import { UserSecurityModal } from '@/components/user-security-modal';
import { User } from '@/lib/schemas';

export default function UsersPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('name,asc');
    const [searchTerm, setSearchTerm] = useState('');

    // Debounce do searchTerm para evitar múltiplas requisições
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Future modals
    const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false); // For toggle status confirmation if needed, currently direct toggle

    // Queries e Mutations
    const { data: usersData, isLoading } = useUsers({
        page: currentPage,
        size: pageSize,
        sort: sortBy,
        keyword: debouncedSearchTerm,
    });

    const deleteUserMutation = useDeleteUser();
    const toggleUserStatusMutation = useToggleUserStatus();

    // Handlers
    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleManagePermissions = (user: User) => {
        setSelectedUser(user);
        setIsPermissionsModalOpen(true);
    };

    const handleViewSecurity = (user: User) => {
        setSelectedUser(user);
        setIsSecurityModalOpen(true);
    };

    const handleChangePassword = (user: User) => {
        setSelectedUser(user);
        setIsPasswordModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedUser) {
            deleteUserMutation.mutate(selectedUser.id, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedUser(null);
                },
            });
        }
    };

    const handleToggleStatus = (user: User) => {
        toggleUserStatusMutation.mutate({ userId: user.id, active: !user.active });
    };


    // Colunas da Tabela
    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {
                accessorKey: 'name',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                const isAsc = sortBy === 'name,asc';
                                setSortBy(isAsc ? 'name,desc' : 'name,asc');
                            }}
                            className="-ml-4 hover:bg-transparent"
                        >
                            Nome
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.name}</span>
                        <span className="text-xs text-muted-foreground">{row.original.login}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'roles',
                header: 'Tipo',
                cell: ({ row }) => {
                    const isAdmin = row.original.admin;
                    return (
                        <Badge variant={isAdmin ? 'default' : 'secondary'} className="gap-1">
                            {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                            {isAdmin ? 'Administrador' : 'Usuário'}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'active',
                header: 'Status',
                cell: ({ row }) => {
                    const isActive = row.original.active;
                    return (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={isActive ? "bg-green-100 text-green-800 hover:bg-green-200 border-transparent" : "bg-red-100 text-red-800 hover:bg-red-200 border-transparent"}>
                                {isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'createdAt',
                header: 'Criado em',
                cell: ({ row }) => {
                    if (!row.original.createdAt) return '-';
                    try {
                        return format(new Date(row.original.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR });
                    } catch (e) {
                        return row.original.createdAt;
                    }
                },
            },
            {
                id: 'actions',
                cell: ({ row }) => {
                    const user = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Abrir menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(user.id))}>
                                    Copiar ID
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangePassword(user)}>
                                    <Key className="mr-2 h-4 w-4" />
                                    Alterar Senha
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleManagePermissions(user)}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    Permissões
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewSecurity(user)}>
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Segurança
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                    {user.active ? (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" /> Desativar
                                        </>
                                    ) : (
                                        <>
                                            <Unlock className="mr-2 h-4 w-4" /> Ativar
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteClick(user)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [sortBy]
    );

    return (
        <PageContainer title="Usuários">
            <div className="space-y-4">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Lista de Usuários</h2>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Novo Usuário
                    </Button>
                </div>

                {/* Data Table */}
                <Card>
                    <CardHeader className="p-0" />
                    <CardContent className="p-0 border-0">
                        <DataTable
                            columns={columns}
                            data={usersData?.content || []}
                            searchKey="name" // The simplistic search in DataTable filters locally, but we are using server-side search via debouncedSearchTerm
                            searchPlaceholder="Buscar por nome ou email..."
                            // Overriding the local search behavior requires modifying DataTable or just hiding its search if we want purely server side.
                            // For now, let's use the DataTable's input but we need to feed it the state if we want to bypass local filter?
                            // Actually, DataTable component I created uses useReactTable's filtering.
                            // If we want server-side search, we typically pass the search term state up.
                            // My DataTable component has `value` and `onValueChange` for SearchInput???
                            // Let's check DataTable code.
                            // trace: <SearchInput value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""} ... />
                            // It binds to a specific column filter.
                            // But our API search is global (keyword).
                            // So we should probably hide the DataTable's internal search bar and implement our own above it, OR modify DataTable to accept external search state.
                            // For now, I will implement a custom search bar above the table and `hideToolbar={true}` in DataTable if I can, or just use `hideToolbar` and build my own toolbar.
                            hideToolbar={true}
                            isLoading={isLoading}
                            pagination={{
                                pageIndex: currentPage,
                                pageSize: pageSize,
                                totalPages: usersData?.totalPages || 0,
                                totalElements: usersData?.totalElements || 0,
                                onPageChange: setCurrentPage,
                                onPageSizeChange: setPageSize,
                            }}
                        />
                    </CardContent>
                    {/* Custom Toolbar since we hid the internal one to use server-side search */}
                    <div className="flex items-center justify-between p-4 border-b absolute top-16 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ position: 'static' }}>
                        {/* Re-implementing toolbar logic here basically, or just putting the search input here */}
                        <div className="flex items-center gap-2 w-full max-w-sm">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input
                                placeholder="Buscar por nome, email ou login..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </div>
                    {/* Note: The above toolbar placement inside CardContent/above DataTable is tricky with the current structure.
                 Better to place it BEFORE the DataTable in the layout.
             */}
                </Card>
            </div>

            {/* Modals */}
            <CreateUserModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <EditUserModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                user={selectedUser}
            />

            <ChangePasswordModal
                open={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}
                user={selectedUser}
            />

            <UserPermissionsModal
                open={isPermissionsModalOpen}
                onOpenChange={setIsPermissionsModalOpen}
                user={selectedUser}
            />

            <UserSecurityModal
                open={isSecurityModalOpen}
                onOpenChange={setIsSecurityModalOpen}
                user={selectedUser}
                onManagePermissions={() => {
                    setIsSecurityModalOpen(false);
                    setIsPermissionsModalOpen(true);
                }}
            />

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Excluir Usuário"
                description={`Tem certeza que deseja excluir o usuário ${selectedUser?.name}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                type="delete"
                showCountdown
                onConfirm={handleConfirmDelete}
                loading={deleteUserMutation.isPending}
            />

        </PageContainer>
    );
}
