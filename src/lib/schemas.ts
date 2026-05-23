import { z } from 'zod';

export const UserMetadataSchema = z.object({
    accessMode: z.enum(['READ_WRITE', 'READ_ONLY', 'DISABLED']).optional(),
    planType: z.enum(['FREE', 'PRO', 'ENTERPRISE']).optional(),
    planExpirationDate: z.string().optional().nullable(),
    proSource: z.enum(['TRIAL', 'SUBSCRIPTION', 'ADMIN_GRANTED']).optional().nullable(),
    maxResources: z.number().optional(),
    maxRequestsPerMonth: z.number().optional(),
    canExportData: z.boolean().optional(),
    canUseReports: z.boolean().optional(),
    canUseAdvancedFeatures: z.boolean().optional(),
    canCreateBudgets: z.boolean().optional(),
    canUseGoals: z.boolean().optional(),
    emailVerified: z.boolean().optional(),
    reputationStatus: z.enum(['GOOD', 'SUSPICIOUS', 'BLOCKED']).optional(),
    suspiciousActivityCount: z.number().optional(),
    lastSecurityCheck: z.string().optional(),
    lastPermissionCheck: z.string().optional(),
    notes: z.string().optional(),
    isLifetimePro: z.boolean().optional(),
    // Limits
    maxAccounts: z.number().optional(),
    maxTransactionsPerMonth: z.number().optional(),
    maxCategoriesPerAccount: z.number().optional(),
});

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    active: z.boolean(),
    admin: z.boolean(),
    login: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    lastAccess: z.string().optional().nullable(),
    imgUrl: z.string().optional().nullable(),
    metadata: UserMetadataSchema.optional().nullable(),
});

export type User = z.infer<typeof UserSchema>;
export type UserMetadata = z.infer<typeof UserMetadataSchema>;

export const SuspiciousActivitySchema = z.object({
    id: z.number(),
    userId: z.number(),
    activityType: z.string(),
    severity: z.string(),
    createdAt: z.string(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    details: z.string().optional(),
    endpoint: z.string().optional(),
});

export type SuspiciousActivity = z.infer<typeof SuspiciousActivitySchema>;

export const UserSecurityBlockSchema = z.object({
    id: z.number(),
    userId: z.number(),
    blockedAt: z.string(),
    blockedUntil: z.string().optional().nullable(),
    reason: z.string(),
    blockedBy: z.string(),
    unblockedAt: z.string().optional().nullable(),
    unblockedBy: z.string().optional().nullable(),
    suspiciousActivityCount: z.number(),
});

export type UserSecurityBlock = z.infer<typeof UserSecurityBlockSchema>;

// Request Types
export const CreateUserRequestSchema = z.object({
    name: z.string().min(3),
    login: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
    roles: z.array(z.string()).optional(),
    active: z.boolean().optional(),
    admin: z.boolean().optional(),
});
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = z.object({
    id: z.number(),
    name: z.string().min(3).optional(),
    login: z.string().optional(),
    email: z.string().email().optional(),
    active: z.boolean().optional(),
    admin: z.boolean().optional(),
});
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const loginSchema = z.object({
    login: z.string().min(1, 'Email ou usuário é obrigatório'),
    password: z.string().min(1, 'Senha é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const profileSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const settingsSchema = z.object({
    theme: z.enum(['light', 'dark', 'system']).optional(),
    language: z.string().optional(),
    locale: z.string().optional(),
    currency: z.string().optional(),
    notifications: z.object({
        billDueDateReminderDays: z.number().optional(),
        monthlyReportEmail: z.boolean().optional(),
    }).optional(),
    preferences: z.object({
        defaultAccountId: z.number().nullable().optional(),
        defaultExpenseCategoryId: z.number().nullable().optional(),
        recurringReminderDays: z.number().optional(),
        autoCategorizationEnabled: z.boolean().optional(),
        useAverageForVariablePending: z.boolean().optional(),
    }).optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export const updateUserSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    active: z.boolean().optional(),
    admin: z.boolean().optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: z.string().min(8, 'Nova senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const updatePasswordRequestSchema = z.object({
    userId: z.number(),
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
});

export type UpdatePasswordRequest = z.infer<typeof updatePasswordRequestSchema>;

export const paginatedUsersSchema = z.object({
    content: z.array(UserSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number(),
    first: z.boolean(),
    last: z.boolean(),
});

export type PaginatedUsers = z.infer<typeof paginatedUsersSchema>;
