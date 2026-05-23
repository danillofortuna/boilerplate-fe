import { useQuery } from '@tanstack/react-query';


export interface Subscription {
    planType: 'PRO' | 'TRIAL' | 'FREE';
    status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'INACTIVE';
    currentPeriodEnd?: string;
}

// Mock subscription hook
export function useMySubscription() {
    return useQuery<Subscription | null>({
        queryKey: ['my-subscription'],
        queryFn: async () => {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            // Return null to simulate free plan, or a mock object
            return null;
        },
    });
}

