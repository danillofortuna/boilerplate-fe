'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CustomScrollbar } from '@/components/ui/custom-scrollbar';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchInput } from '@/components/search-input';
import { EmptyStateIllustration } from '@/components/empty-state-illustration';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKey?: string;
    searchPlaceholder?: string;
    hideToolbar?: boolean;
    showColumnVisibility?: boolean;
    isLoading?: boolean;
    sortInfo?: React.ReactNode;
    skeletonRows?: number;
    emptyMessage?: string;
    emptyDescription?: string;
    pagination?: {
        pageIndex: number;
        pageSize: number;
        totalPages: number;
        totalElements: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };
    hidePagination?: boolean;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder = "Filtrar...",
    isLoading = false,
    sortInfo,
    skeletonRows = 5,
    hideToolbar = false,
    pagination,
    hidePagination,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        // Desabilita paginação interna se temos paginação externa
        manualPagination: !!pagination,
        pageCount: pagination?.totalPages ?? -1,
        // Se não temos paginação externa e hidePagination é true, mostrar todos os dados
        initialState: hidePagination && !pagination ? {
            pagination: {
                pageSize: 99999, // Mostra todos os dados quando não há paginação
            },
        } : undefined,
    });

    return (
        <div className="w-full flex flex-col h-full">
            {!hideToolbar && (
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                        {searchKey && (
                            <SearchInput
                                placeholder={searchPlaceholder}
                                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                                onValueChange={(value) =>
                                    table.getColumn(searchKey)?.setFilterValue(value)
                                }
                                className="w-[320px]"
                            />
                        )}
                        {sortInfo}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Colunas <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    // Mapeamento de tradução para os nomes das colunas
                                    const getColumnDisplayName = (columnId: string) => {
                                        const translations: Record<string, string> = {
                                            'description': 'Descrição',
                                            'paid': 'Situação',
                                            'accountId': 'Conta',
                                            'date': 'Data',
                                            'categoryId': 'Categoria',
                                            'transactionType': 'Tipo',
                                            'amount': 'Valor',
                                            'actions': 'Opções',
                                            'name': 'Nome',
                                            'email': 'Email',
                                            'id': 'ID',
                                            'color': 'Cor',
                                            'icon': 'Ícone',
                                            'archived': 'Arquivado',
                                            'limit': 'Limite',
                                            'brand': 'Bandeira',
                                            'dueDate': 'Vencimento',
                                            'closingDate': 'Fechamento',
                                            'balance': 'Saldo',
                                            'type': 'Tipo',
                                            'status': 'Status',
                                            'createdAt': 'Criado em',
                                            'updatedAt': 'Atualizado em'
                                        };
                                        return translations[columnId] || columnId;
                                    };

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {getColumnDisplayName(column.id)}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
            <CustomScrollbar className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const meta = header.column.columnDef.meta as any;
                                    return (
                                        <TableHead key={header.id} className={meta?.headerClassName}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: skeletonRows }).map((_, index) => (
                                <TableRow key={index}>
                                    {columns.map((_, cellIndex) => (
                                        <TableCell key={cellIndex}>
                                            <div className="h-4 bg-muted animate-pulse rounded" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const meta = cell.column.columnDef.meta as any;
                                        return (
                                            <TableCell key={cell.id} className={meta?.cellClassName}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="p-0"
                                >
                                    <EmptyStateIllustration />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CustomScrollbar>

            {/* Footer com Paginação */}
            {pagination && !hidePagination && (
                <div className="">
                    <div className="px-4 py-4 space-y-4">
                        {/* Info de resultados */}
                        <div className="text-sm text-muted-foreground">
                            Mostrando <span className="font-medium text-foreground">{pagination.pageIndex * pagination.pageSize + 1}</span> até{" "}
                            <span className="font-medium text-foreground">
                                {Math.min(
                                    (pagination.pageIndex + 1) * pagination.pageSize,
                                    pagination.totalElements
                                )}
                            </span>{" "}
                            de <span className="font-medium text-foreground">{pagination.totalElements}</span> resultado(s).
                            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                                <span className="ml-4">
                                    <span className="font-medium text-foreground">{table.getFilteredSelectedRowModel().rows.length}</span> de{" "}
                                    <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> linha(s) selecionada(s).
                                </span>
                            )}
                        </div>

                        {/* Controles de Paginação */}
                        <div className="flex items-center justify-between">
                            {/* Navegação */}
                            <div className="flex items-center gap-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
                                    disabled={pagination.pageIndex === 0}
                                    className="h-9 px-3 gap-1"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                </Button>

                                {/* Números das páginas */}
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNumber;

                                        if (pagination.totalPages <= 5) {
                                            pageNumber = i;
                                        } else if (pagination.pageIndex <= 2) {
                                            pageNumber = i;
                                        } else if (pagination.pageIndex >= pagination.totalPages - 3) {
                                            pageNumber = pagination.totalPages - 5 + i;
                                        } else {
                                            pageNumber = pagination.pageIndex - 2 + i;
                                        }

                                        if (pageNumber < 0 || pageNumber >= pagination.totalPages) return null;

                                        return (
                                            <Button
                                                key={pageNumber}
                                                onClick={() => pagination.onPageChange(pageNumber)}
                                                variant={pageNumber === pagination.pageIndex ? "default" : "ghost"}
                                                size="sm"
                                                className="h-9 w-9 p-0"
                                            >
                                                {pageNumber + 1}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
                                    disabled={pagination.pageIndex >= pagination.totalPages - 1}
                                    className="h-9 px-3 gap-1"
                                >
                                    Próximo
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Controle de linhas por página */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Linhas por página</span>
                                <select
                                    className="h-9 w-[70px] rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                    value={pagination.pageSize}
                                    onChange={(e) => {
                                        pagination.onPageSizeChange(Number(e.target.value));
                                    }}
                                >
                                    {[7, 10, 25, 50, 100, 150].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
