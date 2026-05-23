'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { Meteors } from '@/components/magicui/meteors';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { toast } from 'sonner';
import { useResendEmailVerification } from '@/hooks/auth/use-resend-email-verification';

function EmailVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [countdown, setCountdown] = useState(120); // 2 minutos em segundos
  const [canResend, setCanResend] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { mutate: resendEmail, isPending: isResending } = useResendEmailVerification();

  useEffect(() => {
    // Detectar se é mobile
    const checkIsMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Countdown para habilitar reenvio
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = useCallback(async () => {
    if (!email || isResending) return;
    
    resendEmail({ email }, {
      onSuccess: () => {
        setCountdown(120); // Reset countdown para 2 minutos
        setCanResend(false);
        toast.success('Email de verificação reenviado com sucesso!');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.details || 
                           error?.message || 
                           'Erro ao reenviar email. Tente novamente.';
        toast.error(errorMessage);
      }
    });
  }, [email, isResending, resendEmail]);

  const handleGoToLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  // Função para formatar o countdown em minutos e segundos
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      {!isMobile && (
        <div className="absolute inset-0">
          <Meteors number={6} />
        </div>
      )}
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        {!isMobile && (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
          />
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full mx-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${isMobile ? 'bg-background border' : 'bg-background/80 backdrop-blur-lg'} rounded-2xl p-8 shadow-2xl border-border/50`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-500" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {!isMobile ? (
                <SparklesText className="text-2xl font-bold mb-2">
                  Conta Criada!
                </SparklesText>
              ) : (
                <h1 className="text-2xl font-bold mb-2">Conta Criada!</h1>
              )}
            </motion.div>
            
            <p className="text-muted-foreground">
              Agora você precisa verificar seu email para ativar sua conta
            </p>
          </div>

          {/* Email Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6 mb-6"
          >
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">
                Email de verificação enviado
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Verifique sua caixa de entrada
              </p>
              {email && (
                <p className="text-sm font-mono text-primary">
                  {email}
                </p>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            {/* Resend Email Button */}
            <Button
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                  Reenviando…
                </>
              ) : !canResend ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Reenviar em {formatCountdown(countdown)}
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reenviar email
                </>
              )}
            </Button>

            {/* Go to Login Button */}
            <RainbowButton
              onClick={handleGoToLogin}
              className="w-full h-12 text-sm font-medium"
            >
              <div className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Ir para o Login
              </div>
            </RainbowButton>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 pt-4 border-t border-border/50 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Não recebeu o email? Verifique sua pasta de spam.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <EmailVerificationContent />
    </Suspense>
  );
}
