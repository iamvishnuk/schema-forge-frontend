import { Layers, Settings, Users, Workflow } from 'lucide-react';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ProjectAssociatedMembers from '../_components/ProjectAssociatedMembers';
import ProjectSetting from '../_components/ProjectSetting';
import SchemaEditor from '../_components/react-flow/schema-editor';

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const { id } = await params;
  return (
    <div className='h-full'>
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
          <ProjectAssociatedMembers id={id} />
        </TabsContent>
        <TabsContent value='settings'>
          <ProjectSetting id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
