'use client';
import { useQuery } from '@tanstack/react-query';
import { FileCode, Settings, Users, Workflow } from 'lucide-react';
import { notFound } from 'next/navigation';
import React, { useEffect } from 'react';

import ProjectDetailsLoader from '@/components/loaders/project-details-loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthContext } from '@/context/auth-provider';
import { setProjectRole } from '@/features/project/projectRoleSlice';
import { setProject } from '@/features/project/projectSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { getProjectAssociatedMembersMutationFn } from '@/lib/api';
import { checkProjectRolePermission } from '@/RBAC/project';

import ProjectTeamAndAssociatedMembers from './ProjectAssociatedMembers';
import ProjectSetting from './ProjectSetting';
import SchemaEditor from './react-flow/schema-editor';
import ScriptGeneration from './ScriptGeneration';

type Props = {
  projectId: string;
};

const ProjectTabs = ({ projectId }: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAuthContext();

  const { projectRole } = useAppSelector((state) => state.projectRole);

  const { data, isError, isPending } = useQuery({
    queryKey: ['project-member-role', projectId],
    queryFn: () => getProjectAssociatedMembersMutationFn(projectId)
  });

  const project = data?.data?.project;
  const members = data?.data?.members;

  useEffect(() => {
    if (project && members && user) {
      const currentMember = members.find(
        (member) => member.userId._id === user._id
      );

      if (currentMember) {
        dispatch(
          setProjectRole({
            role: currentMember.role,
            projectId: project._id
          })
        );
      }
      if (project) {
        dispatch(setProject(project));
      }
    }
  }, [project, members, user, dispatch, projectId]);

  if (isError) {
    return notFound();
  }

  if (isPending) {
    return <ProjectDetailsLoader />;
  }

  return (
    <Tabs
      defaultValue='schema'
      className='w-full'
    >
      <TabsList className='mb-3'>
        {checkProjectRolePermission(projectRole, 'project:design:view') && (
          <TabsTrigger value='schema'>
            <Workflow />
            Design
          </TabsTrigger>
        )}

        {checkProjectRolePermission(projectRole, 'project:script:view') && (
          <TabsTrigger value='script'>
            <FileCode />
            Script
          </TabsTrigger>
        )}

        {checkProjectRolePermission(projectRole, 'project:member:view') && (
          <TabsTrigger value='members'>
            <Users />
            Members
          </TabsTrigger>
        )}

        {checkProjectRolePermission(projectRole, 'project:settings:view') && (
          <TabsTrigger value='settings'>
            <Settings />
            Settings
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value='schema'>
        <SchemaEditor id={projectId} />
      </TabsContent>
      <TabsContent value='members'>
        <ProjectTeamAndAssociatedMembers id={projectId} />
      </TabsContent>
      <TabsContent value='settings'>
        <ProjectSetting id={projectId} />
      </TabsContent>
      <TabsContent value='script'>
        <ScriptGeneration projectId={projectId} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
