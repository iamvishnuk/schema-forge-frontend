'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  CalendarDays,
  Edit,
  MoreHorizontal,
  SquareArrowOutUpRight
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ProjectDataBaseTypeEnum } from '@/definitions/enums';
import { IProject } from '@/definitions/interface';
import { MongoDBIcon, MySQLIcon, PostgreSQLIcon, SQLiteIcon } from '@/icons';
import { deleteProjectMutationFn, getProjectsMutationFn } from '@/lib/api';

import ProjectFrom from './_components/ProjectFrom';

type Props = {};

const ProjectPage = ({}: Props) => {
  const [open, setOpen] = useState(false);
  const [projectData, setProjectData] = useState<IProject | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ['get-projects'],
    queryFn: getProjectsMutationFn
  });

  const projects = data?.data;

  const handleOpen = (value: boolean) => setOpen(value);
  const handleShowConfirmation = (value: boolean) => setShowConfirmation(value);

  const { mutate, isPending: isDeletePending } = useMutation({
    mutationFn: deleteProjectMutationFn
  });

  const handleDeleteProject = async (projectId: string) => {
    mutate(projectId, {
      onSuccess: () => {
        toast.success('Success', {
          description: 'Project deleted successfully'
        });
        refetch();
        handleShowConfirmation(false);
      },
      onError: (error) => toast.error('Error', { description: error.message })
    });
  };

  return (
    <div className=''>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Projects</h1>
          <p className='text-muted-foreground mt-1'>
            Manage and organize all your projects
          </p>
        </div>
        <ProjectFrom
          open={open}
          setOpen={handleOpen}
          btnText='Create Project'
          isEdit={isEdit}
          projectData={projectData}
        />
      </div>
      <Separator className='my-4' />

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {projects?.map((project) => (
          <Card
            key={project._id}
            className='shadow-lg transition-all duration-200 hover:shadow-xl'
          >
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <CardTitle className='text-xl font-bold'>
                  {project.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                    >
                      <MoreHorizontal className='h-4 w-4' />
                      <span className='sr-only'>Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>
                      <Link
                        href={`/project/${project._id}`}
                        className='flex w-full gap-2'
                      >
                        <SquareArrowOutUpRight />
                        Open Project
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setIsEdit(true);
                        setProjectData(project);
                        setOpen(true);
                      }}
                    >
                      <Edit />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='text-destructive'
                      asChild
                    >
                      <DeleteConfirmationDialog
                        open={showConfirmation}
                        setOpen={handleShowConfirmation}
                        confirmFn={() => handleDeleteProject(project._id)}
                        isLoading={isDeletePending}
                        description='Are you sure you want to delete this project? This action cannot be undone.'
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className='pb-2'>
              <div className='text-muted-foreground mb-4 flex items-center justify-between gap-4 text-sm'>
                <div className='flex items-center'>
                  <CalendarDays className='mr-1 h-4 w-4' />
                  <span>
                    Updated{' '}
                    {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className='flex items-center'>
                  {project.databaseType === ProjectDataBaseTypeEnum.MONGODB && (
                    <MongoDBIcon className='size-10' />
                  )}
                  {project.databaseType === ProjectDataBaseTypeEnum.SQLITE && (
                    <SQLiteIcon className='size-10' />
                  )}
                  {project.databaseType ===
                    ProjectDataBaseTypeEnum.POSTGRESQL && (
                    <PostgreSQLIcon className='size-10' />
                  )}
                  {project.databaseType === ProjectDataBaseTypeEnum.MYSQL && (
                    <MySQLIcon className='size-10' />
                  )}
                </div>
              </div>
              {/* <div className='flex items-center justify-between'>
                <div className='flex -space-x-2'>
                  {project.members.slice(0, 3).map((member) => (
                    <Avatar
                      key={member.id}
                      className='border-background h-8 w-8 border-2'
                    >
                      <AvatarImage
                        src={member.avatar}
                        alt={member.name}
                      />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.members.length > 3 && (
                    <div className='bg-muted border-background flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium'>
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8'
                >
                  <Users className='mr-2 h-3 w-3' />
                  Manage Team
                </Button>
              </div> */}
            </CardContent>
            <CardFooter className='pt-2'>
              <Link
                href={`/project/${project._id}`}
                className='w-full'
              >
                <Button
                  variant='default'
                  className='w-full bg-blue-600 hover:cursor-pointer hover:bg-blue-700 dark:text-white'
                >
                  <SquareArrowOutUpRight />
                  Open Project
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectPage;
