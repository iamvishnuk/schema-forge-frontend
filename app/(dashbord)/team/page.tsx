'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import TeamPageLoader from '@/components/loaders/team-page-loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/context/auth-provider';
import { ITeam } from '@/definitions/interface';
import { deleteTeamMutationFn, getAllUserTeamsMutationFn } from '@/lib/api';

import TeamForm from './_TeamForm';

export default function TeamsPage() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<ITeam | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ['user-teams'],
    queryFn: getAllUserTeamsMutationFn,
    staleTime: Infinity
  });

  const { mutate, isPending: isDeletePending } = useMutation({
    mutationFn: deleteTeamMutationFn
  });

  const handleOpen = (value: boolean) => setOpen(value);
  const handleShowConfirmation = (value: boolean) => setShowConfirmation(value);

  const teams = data?.data || [];

  const handleDeleteTeam = async (teamId: string) => {
    mutate(teamId, {
      onSuccess: () => {
        toast.success('Success', { description: 'Team deleted successfully' });
        queryClient.invalidateQueries({
          queryKey: ['user-teams']
        });
        handleShowConfirmation(false);
      },
      onError: (error) => toast.error('Error', { description: error.message })
    });
  };

  if (isPending) return <TeamPageLoader />;

  return (
    <div className='container'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Teams</h1>
          <p className='text-muted-foreground mt-1'>
            Manage your teams and team members.
          </p>
        </div>
        <TeamForm
          btnText='Add Team'
          open={open}
          setOpen={handleOpen}
          data={editData}
          setEditData={setEditData}
        />
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {teams.map((team) => (
          <Card key={team._id}>
            <CardHeader>
              <CardTitle className='capitalize'>{team.name}</CardTitle>
              <CardDescription>
                {team.description} <br />
                Created on {format(new Date(team.createdAt), 'MMM dd, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center gap-2'>
                <Users className='text-muted-foreground h-4 w-4' />
                <span className='text-muted-foreground text-sm'>
                  {team.members.length} members
                </span>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button
                variant='outline'
                size='sm'
                asChild
              >
                <Link href={`/team/${team._id}`}>View Team</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  disabled={user?._id !== team.createdBy}
                >
                  <Button
                    variant='ghost'
                    size='sm'
                    className='gap-1'
                  >
                    <Settings className='h-4 w-4' />
                    <span>Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => {
                      handleOpen(true);
                      setEditData(team);
                    }}
                    className='hover:cursor-pointer'
                  >
                    <Edit />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <DeleteConfirmationDialog
                      open={showConfirmation}
                      setOpen={handleShowConfirmation}
                      confirmFn={() => handleDeleteTeam(team._id)}
                      isLoading={isDeletePending}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center'>
          <Users className='text-muted-foreground mb-4 h-10 w-10' />
          <h3 className='text-lg font-medium'>No teams created</h3>
          <p className='text-muted-foreground mb-4 text-sm'>
            You haven't created any teams yet. Teams help you organize your
            projects and collaborate with others.
          </p>
          <TeamForm
            btnText='Create a new team'
            open={open}
            setOpen={handleOpen}
            data={editData}
            setEditData={setEditData}
          />
        </div>
      )}
    </div>
  );
}
