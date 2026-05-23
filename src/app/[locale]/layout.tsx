import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";
import { CustomThemeProvider } from "@/providers/custom-theme-provider";
import { createThemeScript } from "@/lib/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boilerplate React 2026",
  description: "Modern SaaS Boilerplate",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: createThemeScript(),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <CustomThemeProvider>
                {children}
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  toastOptions={{
                    duration: 2000,
                    classNames: {
                      toast: 'font-sans',
                      success: 'bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-700 dark:text-emerald-50',
                      error: 'bg-red-500 text-white border-red-600 dark:bg-red-600 dark:border-red-700 dark:text-red-50',
                      info: 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700 dark:text-blue-50',
                      warning: 'bg-amber-500 text-white border-amber-600 dark:bg-amber-600 dark:border-amber-700 dark:text-amber-50',
                      closeButton: 'bg-white/20 hover:bg-white/30 text-white border-white/20 dark:bg-black/20 dark:hover:bg-black/30'
                    }
                  }}
                />
              </CustomThemeProvider>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
