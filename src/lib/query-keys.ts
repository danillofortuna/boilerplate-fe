export const QueryKeys = {
    CURRENT_USER: 'current-user',
    users: {
        all: ['users'] as const,
        lists: () => [...QueryKeys.users.all, 'list'] as const,
        list: (filters: any) => [...QueryKeys.users.lists(), { ...filters }] as const,
        details: () => [...QueryKeys.users.all, 'detail'] as const,
        detail: (id: number) => [...QueryKeys.users.details(), id] as const,
    },
} as const;

export type QueryKey = typeof QueryKeys[keyof typeof QueryKeys];
