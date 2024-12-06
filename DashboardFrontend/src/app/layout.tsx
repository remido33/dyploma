
import { ReactNode } from 'react';
import { Inter, Mulish } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/globals.css';
import NotificationStack from "@/components/Notifications/Stack";
import { NotificationProvider } from '@/components/Notifications/Provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const mulish = Mulish({
    variable: '--font-mulish',
    weight: ['400', '500'],
    subsets: ['latin'],
});

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="en" className={`${inter.variable} ${mulish.variable}`}>
            <body>
                <NotificationProvider>
                    <Header />
                    <main>
                        {children}
                    </main>
                    <Footer />
                    <NotificationStack />
                </NotificationProvider>
            </body>
        </html>
    );
};

export default RootLayout;
