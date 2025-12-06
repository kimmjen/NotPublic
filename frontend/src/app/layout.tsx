import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/context/LanguageContext';
import { LayoutProvider } from '@/context/LayoutContext';

const inter = Inter({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "NotPublic - 데이터 재난 상황판",
    description: "대한민국 개인정보 유출 사건 모니터링 대시보드",
    keywords: ["데이터 유출", "개인정보", "보안", "사이버보안", "한국"],
    openGraph: {
        title: "NotPublic",
        description: "데이터 재난 상황판 - 실시간 개인정보 유출 모니터링",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body
                className={`${inter.variable} ${robotoMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <LanguageProvider>
                    <LayoutProvider>
                        {children}
                    </LayoutProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}

