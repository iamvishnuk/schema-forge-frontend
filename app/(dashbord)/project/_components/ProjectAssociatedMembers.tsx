'use client';

import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/data-table/data-table';
import { Separator } from '@/components/ui/separator';
import { getProjectAssociatedMembersMutationFn } from '@/lib/api';

import { projectMemberColumns } from './columns';
import InviteProjectMembers from './InviteProjectMembers';

type Props = {
  id: string;
};

const ProjectTeamAndAssociatedMembers = ({ id }: Props) => {
  const { data } = useQuery({
    queryKey: ['project-associated-members', id],
    queryFn: () => getProjectAssociatedMembersMutationFn(id)
  });

  const project = data?.data?.project;
  const members = data?.data?.members;

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>Associated Member</h2>
      </div>
      <InviteProjectMembers
        projectId={id}
        inviteToken={project?.inviteToken!}
      />
      <Separator className='mt-4' />
      <DataTable
        columns={projectMemberColumns}
        data={members || []}
      />
    </div>
  );
};

export default ProjectTeamAndAssociatedMembers;
