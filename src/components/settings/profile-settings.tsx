'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
    Camera,
    User,
    Mail,
    Lock,
    Shield,
    Trash2,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Calendar
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { profileSchema, ProfileFormData } from '@/lib/schemas';
import { useCurrentUser } from '@/hooks/auth/use-current-user';
import { useUpdateUser, useUploadUserImage, useRemoveUserImage } from '@/hooks/users/use-update-user';
import { ChangePasswordModal } from '@/components/change-password-modal';

export function ProfileSettings() {
    const t = useTranslations('Settings');

    const { user } = useCurrentUser();
    const { mutate: updateUser, isPending: isUpdatingProfile } = useUpdateUser();
    const { mutate: uploadImage, isPending: isUploadingImage } = useUploadUserImage();
    const { mutate: removeImage, isPending: isRemovingImage } = useRemoveUserImage();

    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, form]);

    const onSubmit = (data: ProfileFormData) => {
        if (!user) return;
        updateUser({
            ...user,
            ...data,
            id: user.id.toString(),
            login: user.login,
            admin: user.admin,
            active: user.active
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error(t('Profile.imageSizeError'));
                return;
            }
            if (user?.id) {
                uploadImage({ userId: user.id, file });
            }
        }
    };

    const getUserInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    if (!user) return null;

    return (
        <div className="grid gap-6 md:grid-cols-12 animate-in fade-in-50 duration-500">
            {/* Left Column: Identity Card */}
            <div className="md:col-span-4 flex flex-col">
                <Card className="overflow-hidden border-muted-foreground/20 shadow-sm relative h-full flex flex-col">
                    <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent shrink-0"></div>
                    <CardContent className="pt-0 relative flex-1 flex flex-col">
                        <div className="flex flex-col items-center -mt-16 mb-4">
                            <div className="relative group">
                                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                    <AvatarImage src={user.imgUrl} alt={user.name} />
                                    <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                                        {getUserInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <Camera className="h-8 w-8 text-white drop-shadow-md" />
                                </div>
                                <div className="absolute bottom-0 right-0">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className={`h-6 w-6 rounded-full border-2 border-background flex items-center justify-center ${user.active ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {user.active ? <CheckCircle2 className="h-3 w-3 text-white" /> : <AlertCircle className="h-3 w-3 text-white" />}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{user.active ? t('Profile.active') : t('Profile.inactive')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingImage}
                                onChange={handleImageUpload}
                            />

                            {user.imgUrl && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2 text-xs"
                                    onClick={() => user?.id && removeImage(user.id)}
                                    disabled={isRemovingImage}
                                >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    {t('Profile.removePhoto')}
                                </Button>
                            )}
                        </div>

                        <div className="text-center space-y-2 px-1">
                            <div>
                                <h3 className="font-bold text-xl leading-none">{user.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 pt-2">
                                {user.admin && (
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {t('Profile.admin')}
                                    </Badge>
                                )}
                                <Badge variant="outline" className="text-muted-foreground">
                                    <User className="h-3 w-3 mr-1" />
                                    {t('Profile.user')}
                                </Badge>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <Separator className="my-6" />

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {t('Profile.memberSince')}
                                    </span>
                                    <span className="font-medium">Jan 2026</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        {t('Profile.accessLevel')}
                                    </span>
                                    <span className="font-medium">{user.admin ? t('Profile.total') : t('Profile.restricted')}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Details & Security */}
            <div className="md:col-span-8 space-y-6">
                {/* Personal Information */}
                <Card className="border-muted-foreground/20 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            {t('Profile.personalInfo')}
                        </CardTitle>
                        <CardDescription>
                            {t('Profile.personalInfoDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('Profile.fullName')}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={t('Profile.namePlaceholder')} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2">
                                            Email
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Lock className="h-3 w-3 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{t('Profile.emailLockedTooltip')}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                value={user.email}
                                                disabled
                                                className="pl-10 bg-muted/50 text-muted-foreground border-dashed"
                                            />
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">
                                            {t('Profile.emailLockedFooter')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={isUpdatingProfile}>
                                        {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="mr-2 h-4 w-4" />
                                        {t('Profile.saveChanges')}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="border-muted-foreground/20 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            {t('Profile.securityLogin')}
                        </CardTitle>
                        <CardDescription>
                            {t('Profile.securityLoginDesc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                            <div className="space-y-1">
                                <div className="font-medium flex items-center gap-2">
                                    {t('Profile.accessPassword')}
                                    {user.hasLocalPassword && (
                                        <Badge variant="outline" className="text-[10px] h-5 border-green-200 text-green-700 bg-green-50 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800">
                                            {t('Profile.activePassword')}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {user.hasLocalPassword
                                        ? t('Profile.passwordLastChangedRecent')
                                        : t('Profile.noLocalPassword')}
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => setChangePasswordOpen(true)}>
                                {user.hasLocalPassword ? t('Profile.changePassword') : t('Profile.definePassword')}
                            </Button>
                        </div>

                        {!user.hasLocalPassword && user.source === 'GOOGLE' && (
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-300">
                                <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                                    <Shield className="h-4 w-4" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">{t('Profile.googleLinked')}</p>
                                    <p className="opacity-90">{t('Profile.googleLinkedDesc')}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ChangePasswordModal
                open={changePasswordOpen}
                onOpenChange={setChangePasswordOpen}
                user={user}
            />
        </div>
    );
}
