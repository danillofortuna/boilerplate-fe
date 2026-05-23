import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import '../globals.css';

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

export default function ApiDebugLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="pt-BR">
            <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased dark`}>{children}</body>
        </html>
    );
}
