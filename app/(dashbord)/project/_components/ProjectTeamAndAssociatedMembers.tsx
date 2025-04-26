'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';

import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  getProjectAssociatedTeamAndMembersMutationFn,
  removeTeamFromProjectMutationFn
} from '@/lib/api';

import ProjectTeamFrom from './ProjectTeamFrom';

type Props = {
  id: string;
};

const ProjectTeamAndAssociatedMembers = ({ id }: Props) => {
  const [open, setOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ['get-project-associated-team-and-members', id],
    queryFn: () => getProjectAssociatedTeamAndMembersMutationFn(id)
  });

  const projectAssociatedTeamAndMembers = data?.data[0];

  const handleOpen = (value: boolean) => setOpen(value);
  const handleDeleteConfirmation = (value: boolean) =>
    setShowDeleteConfirmation(value);

  const { mutate, isPending } = useMutation({
    mutationFn: removeTeamFromProjectMutationFn
  });

  const handleRemoveTeam = (teamId: string) => {
    mutate(
      { projectId: id, teamId },
      {
        onSuccess: () => {
          toast.success('Team removed from project');
          refetch();
          setShowDeleteConfirmation(false);
        },
        onError: () => {
          toast.error('Failed to remove team from project');
        }
      }
    );
  };

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='mb-3 text-xl font-bold'>Associated Teams</h2>
        <ProjectTeamFrom
          open={open}
          setOpen={handleOpen}
          btnText='Add Team'
          projectId={id}
          existingTeamIds={(projectAssociatedTeamAndMembers?.teamIds || [])
            .map((team) => team._id)
            .filter((id): id is string => id !== undefined)}
        />
      </div>
      {(projectAssociatedTeamAndMembers?.teamIds || []).length > 0 ? (
        (projectAssociatedTeamAndMembers?.teamIds || []).map((team) => (
          <Card
            key={team._id}
            className='mb-3'
          >
            <div className='flex w-full items-center justify-between'>
              <CardHeader>
                <CardTitle className='text-nowrap'>{team.name}</CardTitle>
              </CardHeader>
              <CardFooter className='flex gap-3'>
                <Button
                  variant='secondary'
                  className='btn-primary text-white'
                  asChild
                  size='icon'
                >
                  <Link href={`/team/${team._id}`}>
                    <SquareArrowOutUpRight />
                  </Link>
                </Button>
                <DeleteConfirmationDialog
                  confirmFn={() => {
                    if (team._id) {
                      handleRemoveTeam(team._id);
                    }
                  }}
                  title='Are you sure?'
                  description='Are you sure you want to remove this team from the project?'
                  btnText='Remove'
                  isLoading={isPending}
                  open={showDeleteConfirmation}
                  setOpen={handleDeleteConfirmation}
                  disable={isPending}
                  isIconBtn
                />
              </CardFooter>
            </div>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader className='text-center'>
            <CardTitle className='text-nowrap'>No Associated Teams</CardTitle>
            <CardDescription>
              You can create a new team or add a existing team.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex items-center justify-center gap-3'>
            <Button
              variant='secondary'
              className='btn-primary'
              asChild
            >
              <Link
                href='/team'
                className='text-white'
              >
                Create New Team
              </Link>
            </Button>
            <Button className='btn-primary'>Add Existing Team</Button>
          </CardContent>
        </Card>
      )}

      <Separator className='mt-2 mb-5' />

      <Card className=''>
        <CardHeader>
          <CardTitle>Invite Link</CardTitle>
          <CardDescription>
            Share this link to allow others to join this project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex gap-2'>
            <Input
              value='https://schema-builder.app/invite/project-123456'
              readOnly
              className='font-mono text-sm'
            />
            <Button
              variant='secondary'
              className='btn-primary text-white'
            >
              Copy Link
            </Button>
          </div>
          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='default-role'>Default Role for New Members</Label>
              <Select defaultValue='Viewer'>
                <SelectTrigger
                  id='default-role'
                  className='w-[130px]'
                >
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Editor'>Editor</SelectItem>
                  <SelectItem value='Viewer'>Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className='text-muted-foreground mt-2 text-xs'>
              Anyone who joins via the invite link will be assigned this role by
              default.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTeamAndAssociatedMembers;
