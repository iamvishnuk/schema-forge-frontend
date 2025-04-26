'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Edit, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
  getProjectDetailsByIdMutationFn,
  updateProjectMutationFn
} from '@/lib/api';
import { ProjectUpdateSchema } from '@/validation';

type Props = { id: string };

const ProjectSetting = ({ id }: Props) => {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);

  const { data } = useQuery({
    queryKey: ['project-details', id],
    queryFn: () => getProjectDetailsByIdMutationFn(id)
  });

  const projectDetails = data?.data;

  const form = useForm<z.infer<typeof ProjectUpdateSchema>>({
    resolver: zodResolver(ProjectUpdateSchema),
    defaultValues: {
      name: projectDetails?.name || '',
      description: projectDetails?.description || '',
      tag: projectDetails?.tag || []
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProjectMutationFn,
    onSuccess: () => {
      setIsEditing(false);
    }
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

  return (
    <div>
      <Card className='mt-3'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className='flex items-center justify-between'>
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
    </div>
  );
};

export default ProjectSetting;
