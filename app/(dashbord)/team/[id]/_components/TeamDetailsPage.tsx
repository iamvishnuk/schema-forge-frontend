'use client';

import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import React, { useEffect } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import TeamDetailsPageLoader from '@/components/loaders/team-details-loader';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/auth-provider';
import { ITeamMemberWithUser } from '@/definitions/interface';
import { setTeamRole } from '@/features/team/teamRoleSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { getTeamByIdMutationFn } from '@/lib/api';
import { TEAM_MEMBER_STATUS, TEAM_ROLES } from '@/lib/constant';

import { teamMemberColumns } from './columns';
import InviteMemberModel from './InviteMemberModel';

type Props = {
  teamId: string;
};

const TeamDetailsPage = ({ teamId }: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAuthContext();

  const { data, isPending, isError } = useQuery({
    queryKey: ['team-details', teamId],
    queryFn: () => getTeamByIdMutationFn(teamId)
  });

  const teamDetails = data?.data;

  useEffect(() => {
    if (teamDetails && user) {
      // Find the current user's role in the team
      const currentUserMember = teamDetails.teamMember?.find(
        (member: ITeamMemberWithUser) => member.userId._id === user._id
      );

      if (currentUserMember) {
        // Dispatch the action to set team role in Redux store
        dispatch(
          setTeamRole({
            role: currentUserMember.role,
            teamId: teamId
          })
        );
      }
    }
  }, [teamDetails, user, dispatch, teamId]);

  if (isError) {
    return notFound();
  }

  if (isPending) {
    return <TeamDetailsPageLoader />;
  }

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            {teamDetails?.team.name}
          </h1>
          <p className='text-muted-foreground mt-1'>
            {teamDetails?.team?.description}
          </p>
        </div>
        <InviteMemberModel teamId={teamDetails?.team._id!} />
      </div>
      <Separator className='mt-4' />
      <DataTable
        columns={teamMemberColumns}
        data={teamDetails?.teamMember || []}
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
