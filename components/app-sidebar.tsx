'use client';

import { Frame, LayoutDashboardIcon, Map, PieChart, Users } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboardIcon },
    { title: 'Team', url: '/team', icon: Users }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
      isActive: true
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
      isActive: true
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
      isActive: true
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible='offcanvas'
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
