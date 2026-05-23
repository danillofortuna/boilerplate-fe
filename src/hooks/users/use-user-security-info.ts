import { useQuery } from '@tanstack/react-query';

export function useUserSecurityInfo(userId: number, enabled: boolean) {
    return useQuery({
        queryKey: ['user-security', userId],
        queryFn: async () => {
            // Mock Data since endpoint is not implemented
            return {
                reputationStatus: 'GOOD',
                suspiciousActivityCount: 0,
                lastSecurityCheck: new Date().toISOString(),
                recentActivities: [],
                blockHistory: [],
                currentBlock: null,
            };
        },
        enabled: enabled && !!userId,
    });
}
