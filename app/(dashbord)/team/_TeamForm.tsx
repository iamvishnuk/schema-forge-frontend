'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, PlusCircle } from 'lucide-react';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IGetUserTeams } from '@/definitions/interface';
import { createTeamMutationFn, updateTeamDetailsMutationFn } from '@/lib/api';
import { CreateTeamSchema } from '@/validation';

type Props = {
  btnText: string;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (value: boolean) => void;
  data?: IGetUserTeams | null;
  setEditData: Dispatch<SetStateAction<IGetUserTeams | null>>;
};

const TeamForm = ({ btnText, open, setOpen, data, setEditData }: Props) => {
  const queryClient = useQueryClient();
  const isEditMode = Boolean(data);

  const form = useForm<z.infer<typeof CreateTeamSchema>>({
    resolver: zodResolver(CreateTeamSchema),
    defaultValues: { name: '', description: '' }
  });

  // Update form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        description: data.description
      });
    } else {
      form.reset({ name: '', description: '' });
    }
  }, [data, form]);

  const createMutation = useMutation({
    mutationFn: createTeamMutationFn
  });

  const updateMutation = useMutation({
    mutationFn: updateTeamDetailsMutationFn
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: z.infer<typeof CreateTeamSchema>) => {
    if (isEditMode) {
      updateMutation.mutate(
        { ...values, teamId: data?._id! },
        {
          onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: ['user-teams']
            });
            form.reset();
            toast.success('success', {
              description: 'Team updated successfully'
            });
            setEditData(null);
          },
          onError: (error) => {
            toast.error('error', { description: error.message });
          }
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          setOpen(false);
          queryClient.invalidateQueries({
            queryKey: ['user-teams']
          });
          form.reset();
          toast.success('success', {
            description: 'Team created successfully'
          });
          setEditData(null);
        },
        onError: (error) => {
          toast.error('error', { description: error.message });
        }
      });
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (!value) {
            form.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className='bg-blue-600 hover:cursor-pointer hover:bg-blue-700 dark:text-white'>
            <PlusCircle className='mr-2 h-4 w-4' />
            {btnText}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? 'Edit team' : 'Create a new team'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update your team's information."
                : 'Add a new team to collaborate with your colleagues.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className=''
                        placeholder='Enter team name'
                        {...field}
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
                        disabled={isPending}
                        placeholder='Group description (optional)'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant='destructive'
                  type='button'
                  onClick={() => {
                    setOpen(false);
                    form.reset();
                  }}
                  className='hover:cursor-pointer dark:bg-red-600 dark:hover:bg-red-700'
                >
                  Cancel
                </Button>
                <Button
                  className='bg-blue-600 hover:cursor-pointer hover:bg-blue-700 dark:text-white'
                  type='submit'
                >
                  {isPending && (
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  {isEditMode ? 'Update Team' : 'Create Team'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamForm;
