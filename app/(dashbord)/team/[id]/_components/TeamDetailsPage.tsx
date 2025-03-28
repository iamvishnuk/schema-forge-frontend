'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { Separator } from '@/components/ui/separator';
import { getTeamByIdMutationFn } from '@/lib/api';
import { TEAM_MEMBER_STATUS, TEAM_ROLES } from '@/lib/constant';

import { teamMemberColumns } from './columns';
import InviteMemberModel from './InviteMemberModel';

type Props = {
  teamId: string;
};

const TeamDetailsPage = ({ teamId }: Props) => {
  const { data } = useQuery({
    queryKey: ['team-details', teamId],
    queryFn: () => getTeamByIdMutationFn(teamId),
    staleTime: Infinity
  });

  const teamDetails = data?.data;

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {teamDetails?.name}
          </h1>
          <p className='text-muted-foreground mt-1'>
            {teamDetails?.description}
          </p>
        </div>
        <InviteMemberModel />
      </div>
      <Separator className='mt-4' />
      <DataTable
        columns={teamMemberColumns}
        data={teamDetails?.members || []}
        filterOptions={[
          { filterKey: 'role', filterTitle: 'Role', filterOptions: TEAM_ROLES },
          {
            filterKey: 'status',
            filterTitle: 'Status',
            filterOptions: TEAM_MEMBER_STATUS
          }
        ]}
      />
    </div>
  );
};

export default TeamDetailsPage;
