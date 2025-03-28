'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './ui/breadcrumb';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

type BreadcrumbItem = {
  href: string;
  label: string;
  isCurrentPage?: boolean;
};

const Header = () => {
  const pathname = usePathname();

  // Generate breadcrumb items based on the current pathname
  const generateBreadcrumbs = () => {
    const breadcrumbs: BreadcrumbItem[] = [];

    // Split the pathname and build breadcrumb items
    const segments = pathname.split('/').filter(Boolean);
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Format the segment for display (capitalize, replace hyphens with spaces)
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // If it's the last segment, we'll display it as the current page
      // Otherwise, it will be a link
      breadcrumbs.push({
        href: currentPath,
        label,
        isCurrentPage: index === segments.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.href}>
                {index > 0 && (
                  <BreadcrumbSeparator
                    className={index === 1 ? 'hidden md:block' : ''}
                  />
                )}
                <BreadcrumbItem
                  className={index === 0 ? 'hidden md:block' : ''}
                >
                  {breadcrumb.isCurrentPage ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Header;
