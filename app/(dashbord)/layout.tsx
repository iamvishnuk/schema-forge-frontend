import { ReactNode } from 'react';

export default function DashBoardLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className='min-h-screen text-gray-300'>{children}</div>;
}
