import { ArrowLeft, Layers, Settings, Users, Workflow } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ProjectTeamManagement from '../_components/ProjectTeamManagement';
import SchemaEditor from '../_components/react-flow/schema-editor';

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <div className='h-full'>
      <div className='mb-4 flex items-center'>
        <Button
          variant='ghost'
          size='sm'
          asChild
          className='mr-4'
        >
          <Link href='/project'>
            <ArrowLeft className='mr-2 h-4 w-4' />
          </Link>
        </Button>
        <h1 className='text-3xl font-bold tracking-tight'>
          Vishnu's Project 1
        </h1>
      </div>
      <Separator className='mb-3' />
      <Tabs
        defaultValue='schema'
        className='w-full'
      >
        <TabsList className='mb-3'>
          <TabsTrigger value='schema'>
            <Workflow />
            Design
          </TabsTrigger>
          <TabsTrigger value='collection'>
            <Layers />
            Collections
          </TabsTrigger>
          <TabsTrigger value='team'>
            <Users />
            Team
          </TabsTrigger>
          <TabsTrigger value='settings'>
            <Settings />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value='schema'>
          <SchemaEditor id={id} />
        </TabsContent>
        <TabsContent value='team'>
          <ProjectTeamManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
