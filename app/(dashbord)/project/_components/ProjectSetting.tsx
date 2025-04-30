'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Edit, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MultipleSelector from '@/components/ui/multiple-selector';
import { Textarea } from '@/components/ui/textarea';
import {
  deleteProjectMutationFn,
  getProjectDetailsByIdMutationFn,
  updateProjectMutationFn
} from '@/lib/api';
import { ProjectUpdateSchema } from '@/validation';

type Props = { id: string };

const ProjectSetting = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const { data, isSuccess } = useQuery({
    queryKey: ['project-details', id],
    queryFn: () => getProjectDetailsByIdMutationFn(id)
  });

  const projectDetails = data?.data;

  const form = useForm<z.infer<typeof ProjectUpdateSchema>>({
    resolver: zodResolver(ProjectUpdateSchema),
    defaultValues: {
      name: '',
      description: '',
      tag: []
    }
  });

  // Update form values when project details are fetched
  useEffect(() => {
    if (isSuccess && projectDetails) {
      form.reset({
        name: projectDetails.name || '',
        description: projectDetails.description || '',
        tag: projectDetails.tag || []
      });
    }
  }, [form, projectDetails, isSuccess]);

  const updateProjectMutation = useMutation({
    mutationFn: updateProjectMutationFn
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProjectMutationFn
  });

  const onSubmit = (values: z.infer<typeof ProjectUpdateSchema>) => {
    updateProjectMutation.mutate(
      {
        ...values,
        databaseType: projectDetails?.databaseType,
        projectId: id
      },
      {
        onSuccess: () => {
          toast.success('Project updated successfully');
          queryClient.invalidateQueries({
            queryKey: ['project-details']
          });
          setIsEditing(false);
        },
        onError: (error) => {
          toast.error('Failed to update project', {
            description: error.message
          });
        }
      }
    );
  };

  const toggleConfirmationDialog = (value: boolean) =>
    setShowConfirmationDialog(value);

  const handleDeleteProject = async (projectId: string) => {
    deleteProjectMutation.mutate(projectId, {
      onSuccess: () => {
        toast.success('Success', {
          description: 'Project deleted successfully'
        });
        queryClient.invalidateQueries({
          queryKey: ['get-projects']
        });
        router.push('/project');
        toggleConfirmationDialog(false);
      },
      onError: (error) => toast.error('Error', { description: error.message })
    });
  };

  return (
    <div>
      <Card className='mt-3'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className='mb-3 flex items-center justify-between border-b pb-3'>
                <h2 className='text-xl font-bold'>Project Details</h2>
                <div className='flex items-center gap-2'>
                  {isEditing && (
                    <Button
                      size='icon'
                      type='submit'
                      className='bg-green-600 hover:cursor-pointer hover:bg-green-700 dark:text-white'
                      disabled={updateProjectMutation.isPending}
                    >
                      <Check />
                    </Button>
                  )}

                  <Button
                    size='icon'
                    type='button'
                    className='bg-blue-600 hover:cursor-pointer hover:bg-blue-700 dark:text-white'
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={updateProjectMutation.isPending}
                  >
                    {isEditing ? <X /> : <Edit />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-5'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='gap-1'>
                        Name<span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter project name'
                          {...field}
                          disabled={
                            !isEditing || updateProjectMutation.isPending
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Project description (optional)'
                          rows={3}
                          {...field}
                          disabled={
                            !isEditing || updateProjectMutation.isPending
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='tag'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          creatable
                          placeholder='Type something and press enter (optional)'
                          onChange={(value) => {
                            field.onChange(value.map((item) => item.value));
                          }}
                          options={[]}
                          disabled={
                            !isEditing || updateProjectMutation.isPending
                          }
                          value={form
                            .getValues('tag')
                            .map((tag) => ({ label: tag, value: tag }))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>

      <div className='mt-8'>
        <h2 className='text-xl font-bold'>Danger Zone</h2>
        <Card className='mt-2 border-red-500'>
          <CardContent>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-bold'>Delete this Project</h3>
                <h3 className='text-sm'>
                  Once you delete a Project, there is no going back. Please be
                  certain.
                </h3>
              </div>
              <DeleteConfirmationDialog
                btnClassName='border border-red-500 bg-transparent text-red-500 hover:cursor-pointer hover:bg-red-500 hover:text-white dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white w-fit'
                open={showConfirmationDialog}
                setOpen={toggleConfirmationDialog}
                confirmFn={() => handleDeleteProject(id)}
                isLoading={deleteProjectMutation.isPending}
                btnText='Delete This Project'
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectSetting;
