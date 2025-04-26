import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React from 'react';
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
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import {
  addTeamToProjectMutationFn,
  getUserCreatedTeamsMutationFn
} from '@/lib/api';
import { AddTeamToProjectSchema } from '@/validation';

type Props = {
  open: boolean;
  btnText: string;
  projectId: string;
  existingTeamIds?: string[];
  // eslint-disable-next-line no-unused-vars
  setOpen: (value: boolean) => void;
};

const ProjectTeamFrom = ({
  open,
  setOpen,
  btnText,
  projectId,
  existingTeamIds
}: Props) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['user-created-teams'],
    queryFn: getUserCreatedTeamsMutationFn,
    enabled: open
  });

  const TEAM_OPTIONS: Option[] =
    data?.data
      .filter((team) => !existingTeamIds?.includes(team._id))
      .map((team) => {
        return {
          label: team.name,
          value: team._id
        };
      }) || [];

  const { mutate, isPending } = useMutation({
    mutationKey: ['add-team-to-project'],
    mutationFn: addTeamToProjectMutationFn
  });

  const form = useForm<z.infer<typeof AddTeamToProjectSchema>>({
    resolver: zodResolver(AddTeamToProjectSchema),
    defaultValues: {
      teamIds: []
    }
  });

  const onSubmit = async (values: z.infer<typeof AddTeamToProjectSchema>) => {
    const data = {
      projectId,
      teamIds: values.teamIds
    };
    mutate(data, {
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries({
          queryKey: ['get-project-associated-team-and-members']
        });
        toast.success('Team added', {
          description: 'Team added to project successfully'
        });
        setOpen(false);
      },
      onError: (error) => {
        console.error('Error adding team to project:', error);
        toast.error('Error adding team to project', {
          description: error.message
        });
      }
    });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => setOpen(value)}
    >
      <DialogTrigger asChild>
        <DialogTrigger asChild>
          <Button className='bg-blue-600 hover:cursor-pointer hover:bg-blue-700 dark:text-white'>
            {btnText}
          </Button>
        </DialogTrigger>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team</DialogTitle>
          <DialogDescription>Add a new team to the project.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='teamIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      onChange={(value) => {
                        field.onChange(value.map((item) => item.value));
                      }}
                      placeholder='Select teams'
                      disabled={isPending}
                      options={TEAM_OPTIONS}
                      value={TEAM_OPTIONS.filter((option) => {
                        return form.getValues('teamIds').includes(option.value);
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='mt-3'>
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
                {isPending && <Loader className='animate-spin' />}
                Add Team
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectTeamFrom;
