import '@/app/globals.css';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/app-sidebar';
import { LogoutButton } from '@/components/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { auth } from '@/shared/auth';

const poppins = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: 'GitRuley',
    description: 'GitRuley is a platform for managing github repositories rulesets',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    return (
        <html lang="en">
            <body className={`${poppins.variable} antialiased dark`}>
                <div className="w-full min-h-screen flex flex-col">
                    <div className="flex items-center justify-between p-4 w-full border-b-[1px] border-secondary">
                        <span className="text-2xl font-bold">GitRuley</span>
                        {session && (
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={session?.user?.image ?? ''} />
                                    <AvatarFallback>
                                        {session?.user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <LogoutButton />
                            </div>
                        )}
                    </div>
                    <main className="m-4 flex-1 ">{children}</main>
                </div>
                <Toaster />
            </body>
        </html>
    );
}
