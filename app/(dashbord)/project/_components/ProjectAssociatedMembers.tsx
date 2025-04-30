'use client';

import { useQuery } from '@tanstack/react-query';

import { getProjectAssociatedMembersMutationFn } from '@/lib/api';

import InviteProjectMembers from './InviteProjectMembers';

type Props = {
  id: string;
};

const ProjectTeamAndAssociatedMembers = ({ id }: Props) => {
  const { data } = useQuery({
    queryKey: ['project-associated-members', id],
    queryFn: () => getProjectAssociatedMembersMutationFn(id)
  });

  const projectAssociatedMembers = data?.data;

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='mb-3 text-xl font-bold'>Associated Member</h2>
      </div>
      <InviteProjectMembers
        projectId={id}
        inviteToken={projectAssociatedMembers?.project?.inviteToken!}
      />
    </div>
  );
};

export default ProjectTeamAndAssociatedMembers;
