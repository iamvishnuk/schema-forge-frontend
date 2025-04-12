import { ReactNode } from 'react';

import { SocketProvider } from '@/context/socket-provider';

export default function ProjectDetailsLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <SocketProvider>{children}</SocketProvider>;
}
