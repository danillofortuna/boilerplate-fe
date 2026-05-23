'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignup } from '@/hooks/auth';
import { signupSchema, SignupFormData } from '@/lib/schemas';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button, Field, PasswordField } from '@/components/ui';
import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { ShineBorder } from '@/components/magicui/shine-border';
import { Meteors } from '@/components/magicui/meteors';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { OAuth2LoginSection } from '@/components/oauth2';

import { useTranslations } from 'next-intl';

function SignupContent() {
    const t = useTranslations('Auth.Signup');
    const { mutate: signup, isPending, error } = useSignup();
    const [isMobile, setIsMobile] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);

    useEffect(() => {
        const checkIsMobile = () => {
            const isMobileDevice = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            setIsMobile(isMobileDevice)
        }

        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)

        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data: SignupFormData) => {
        setSubmitCount(prev => prev + 1);
        signup(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
            {/* Meteors Background - Only on desktop */}
            {!isMobile && (
                <div className="absolute inset-0">
                    <Meteors number={8} />
                </div>
            )}

            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                {!isMobile ? (
                    <>
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/15 to-secondary/15 rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1.1, 1, 1.1],
                                rotate: [360, 180, 0],
                            }}
                            transition={{
                                duration: 30,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl"
                        />
                    </>
                ) : (
                    // Static background for mobile
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-2xl" />
                )}
            </div>

            {/* Back to Home Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-8 left-8 z-20"
            >
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        {t('backToHome')}
                    </Button>
                </Link>
            </motion.div>

            <div className="max-w-md w-full mx-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: isMobile ? 0.4 : 0.8 }}
                    className="relative bg-background/80 dark:bg-background/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl"
                >
                    {/* ShineBorder - Only on desktop */}
                    {!isMobile && (
                        <ShineBorder
                            borderWidth={2}
                            duration={12}
                            shineColor={["#A07CFE", "#FE8FB5"]}
                        />
                    )}

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={isMobile ? { duration: 0.3 } : { type: "spring", delay: 0.2 }}
                            className="mx-auto h-16 w-16 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center mb-4 shadow-lg"
                        >
                            <UserPlus className="h-8 w-8 text-primary-foreground" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: isMobile ? 0.1 : 0.3 }}
                        >
                            {isMobile ? (
                                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    {t('title')}
                                </h1>
                            ) : (
                                <SparklesText
                                    colors={{ first: "#A07CFE", second: "#FE8FB5" }}
                                    className="text-3xl font-bold mb-2"
                                >
                                    {t('title')}
                                </SparklesText>
                            )}
                            <p className="text-muted-foreground">
                                {t('subtitle')}
                            </p>
                        </motion.div>
                    </div>

                    {/* Form */}
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: isMobile ? 0.2 : 0.4 }}
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        className="space-y-5"
                    >
                        <Field
                            label={t('nameLabel')}
                            type="text"
                            autoComplete="name"
                            placeholder={t('namePlaceholder')}
                            error={errors.name?.message}
                            touched={touchedFields.name}
                            submitCount={submitCount}
                            required
                            className={isMobile ? 'bg-background border' : 'bg-background/50 backdrop-blur-sm'}
                            {...register('name')}
                        />

                        <Field
                            label={t('emailLabel')}
                            type="email"
                            autoComplete="email"
                            placeholder={t('emailPlaceholder')}
                            error={errors.email?.message}
                            touched={touchedFields.email}
                            submitCount={submitCount}
                            required
                            className={isMobile ? 'bg-background border' : 'bg-background/50 backdrop-blur-sm'}
                            {...register('email')}
                        />

                        <PasswordField
                            label={t('passwordLabel')}
                            autoComplete="new-password"
                            placeholder={t('passwordPlaceholder')}
                            error={errors.password?.message}
                            touched={touchedFields.password}
                            submitCount={submitCount}
                            required
                            className={isMobile ? 'bg-background border' : 'bg-background/50 backdrop-blur-sm'}
                            {...register('password')}
                        />

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
                            >
                                <p className="text-sm text-red-500">
                                    {t('errors.generic')}
                                </p>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <RainbowButton
                            type="submit"
                            disabled={isPending}
                            className="w-full h-12 text-base font-medium"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {t('submitting')}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    {t('submit')}
                                </div>
                            )}
                        </RainbowButton>
                    </motion.form>

                    {/* OAuth2 Login Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: isMobile ? 0.4 : 0.8 }}
                        className="mt-6"
                    >
                        <OAuth2LoginSection
                            providers={['google']}
                            className="w-full"
                        />
                    </motion.div>

                    {/* Footer Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: isMobile ? 0.3 : 0.6 }}
                        className="mt-8 text-center space-y-4"
                    >
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <span>{t('hasAccount')}</span>
                            <Link
                                href="/login"
                                className="text-primary hover:text-primary/80 font-medium transition-colors underline underline-offset-2"
                            >
                                {t('signIn')}
                            </Link>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-border/50">
                            <p className="text-xs text-muted-foreground mt-2">
                                {t('copyright', { year: new Date().getFullYear() })}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <SignupContent />
        </Suspense>
    );
}
