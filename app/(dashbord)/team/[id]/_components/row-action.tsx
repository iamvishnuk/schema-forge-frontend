import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/context/auth-provider';
import { ITeamMemberWithUser } from '@/definitions/interface';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  changeTeamMemberRoleMutationFn,
  leaveOrRemoveTeamMemberMutationFn
} from '@/lib/api';
import { TEAM_ROLES } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { checkTeamRolePermission } from '@/RBAC/team';

interface DataTableRowActionsProps<TData extends ITeamMemberWithUser> {
  row: Row<TData>;
}

export function RowAction<TData extends ITeamMemberWithUser>({
  row
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { teamRole } = useAppSelector((state) => state.teamRole);
  const { user } = useAuthContext();

  const [open, setOpen] = useState(false);

  const data = row.original;

  const leaveOrRemoveMutation = useMutation({
    mutationFn: leaveOrRemoveTeamMemberMutationFn
  });

  const changeRoleMutation = useMutation({
    mutationFn: changeTeamMemberRoleMutationFn
  });

  const handleRoleChange = async (role: string) => {
    changeRoleMutation.mutate(
      { role, id: data._id },
      {
        onSuccess: (data) => {
          toast.success('Success', {
            description: data.message
          });
          queryClient.invalidateQueries({
            queryKey: ['team-details']
          });
        },
        onError: (error) => {
          toast.error('Error', { description: error.message });
        }
      }
    );
  };

  const handleLeaveOrRemove = async (id: string) => {
    leaveOrRemoveMutation.mutate(id, {
      onSuccess: (data) => {
        setOpen(false);
        toast.success('Success', {
          description: data.message
        });

        if (data.data.isSelf) {
          router.push('/team');
        } else {
          queryClient.invalidateQueries({
            queryKey: ['team-details']
          });
        }
      },
      onError: (error) => {
        setOpen(false);
        toast.error('Error', { description: error.message });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
        >
          <MoreHorizontal className='size-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <DeleteConfirmationDialog
            open={open}
            setOpen={(value: boolean) => {
              setOpen(value);
            }}
            confirmFn={() => handleLeaveOrRemove(data._id)}
            isLoading={leaveOrRemoveMutation.isPending}
            btnText={user?._id === data.userId._id ? 'Leave' : 'Remove'}
            disable={
              data.role === 'owner' ||
              (user?._id !== data.userId._id &&
                !checkTeamRolePermission(teamRole, 'team:remove_member'))
            }
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            disabled={
              !checkTeamRolePermission(teamRole, 'team:change_member_roles') ||
              data.role === 'owner' ||
              user?._id === data.userId._id
            }
            className={cn(
              checkTeamRolePermission(teamRole, 'team:change_member_roles')
                ? ''
                : 'cursor-not-allowed opacity-50',
              data.role === 'owner' ? 'cursor-not-allowed opacity-50' : '',
              user?._id === data.userId._id
                ? 'cursor-not-allowed opacity-50'
                : ''
            )}
          >
            Roles
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={row.getValue('role')}
              onValueChange={(value) => handleRoleChange(value)}
            >
              {TEAM_ROLES.filter((role) => role.value !== 'owner').map(
                (role, index) => (
                  <DropdownMenuRadioItem
                    value={role.value}
                    key={index}
                  >
                    {role.label}
                  </DropdownMenuRadioItem>
                )
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
