import { ReactNode } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import Header from '@/components/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/auth-provider';

export default function DashBoardLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className='p-4'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
