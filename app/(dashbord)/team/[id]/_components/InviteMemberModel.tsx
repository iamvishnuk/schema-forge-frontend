import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader, Send } from 'lucide-react';
import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/hooks/useAppSelector';
import { inviteTeamMemberMutationFn } from '@/lib/api';
import { checkTeamRolePermission } from '@/RBAC/team';
import { InviteTeamMemberSchema } from '@/validation';

type Props = {
  teamId: string;
};

const INVITE_TEAM_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' }
];

const InviteMemberModel = ({ teamId }: Props) => {
  const [open, setOpen] = useState(false);
  const { teamRole } = useAppSelector((state) => state.teamRole);

  const form = useForm<z.infer<typeof InviteTeamMemberSchema>>({
    resolver: zodResolver(InviteTeamMemberSchema),
    defaultValues: {
      inviteeEmail: '',
      role: undefined
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: inviteTeamMemberMutationFn
  });

  const onSubmit = async (values: z.infer<typeof InviteTeamMemberSchema>) => {
    mutate(
      { teamId, ...values },
      {
        onSuccess: () => {
          toast.success('Team member invited successfully', {
            description: 'The invitation has been sent successfully.'
          });
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast.error('Error', { description: error.message });
        }
      }
    );
  };

  if (!checkTeamRolePermission(teamRole, 'team:invite')) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className='bg-blue-600 text-white hover:cursor-pointer hover:bg-blue-700'>
          <Send />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-lg'>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to invite to the
            team.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='my-2 space-y-6'
          >
            <FormField
              control={form.control}
              name='inviteeEmail'
              render={({ field }) => (
                <FormItem className='grid grid-cols-4 gap-4'>
                  <FormLabel className='justify-end'>Email</FormLabel>
                  <FormControl className='col-span-3'>
                    <div>
                      <Input
                        type='email'
                        placeholder='Enter email'
                        disabled={isPending}
                        {...field}
                      />
                      <FormMessage className='mt-0.5 ml-0.5' />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem className='gird grid-cols-4 gap-4'>
                  <FormLabel className='justify-end'>Role</FormLabel>
                  <div className='col-span-3 w-full'>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INVITE_TEAM_ROLES.map((role, index) => (
                          <SelectItem
                            key={index}
                            value={role.value}
                          >
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='mt-0.5 ml-0.5' />
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant='outline'
                type='button'
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
                className='hover:cursor-pointer'
              >
                Cancel
              </Button>
              <Button
                className='bg-blue-600 hover:cursor-pointer hover:bg-blue-700 dark:text-white'
                type='submit'
              >
                {isPending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
                Invite
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModel;
