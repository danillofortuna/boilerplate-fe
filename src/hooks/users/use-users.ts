import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QueryKeys } from '@/lib/query-keys';
import { PaginatedUsers } from '@/lib/schemas';

interface UseUsersParams {
    page?: number;
    size?: number;
    sort?: string;
    keyword?: string;
    enabled?: boolean;
}

export function useUsers({
    page = 0,
    size = 10,
    sort = 'name,asc',
    keyword,
    enabled = true
}: UseUsersParams = {}) {
    return useQuery({
        queryKey: QueryKeys.users.list({ page, size, sort, keyword }),
        queryFn: async (): Promise<PaginatedUsers> => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('size', size.toString());
            params.append('sort', sort);

            if (keyword && keyword.trim() !== '') {
                params.append('keyword', keyword);
            }

            const response = await api.get(`/v1/users?${params.toString()}`);
            return response.data;
        },
        enabled,
    });
}
