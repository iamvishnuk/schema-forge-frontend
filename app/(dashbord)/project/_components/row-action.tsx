import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { ProjectMemberRoleEnum } from '@/definitions/enums';
import { IProjectMemberWithUser } from '@/definitions/interface';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  changeProjectMemberRoleMutationFn,
  leaveOrRemoveProjectMemberMutationFn
} from '@/lib/api';
import { PROJECT_MEMBER_ROLES } from '@/lib/constant';
import { checkProjectRolePermission } from '@/RBAC/project';

interface DataTableRowActionsProps<TData extends IProjectMemberWithUser> {
  row: Row<TData>;
}
export function RowAction<TData extends IProjectMemberWithUser>({
  row
}: DataTableRowActionsProps<TData>) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { projectRole } = useAppSelector((state) => state.projectRole);

  const [open, setOpen] = useState(false);

  const data = row.original;

  const changeRoleMutation = useMutation({
    mutationFn: changeProjectMemberRoleMutationFn
  });

  const leaveOrRemoveMutation = useMutation({
    mutationFn: leaveOrRemoveProjectMemberMutationFn
  });

  const handleRoleChange = (role: ProjectMemberRoleEnum) => {
    changeRoleMutation.mutate(
      { role, id: data._id },
      {
        onSuccess: (data) => {
          toast.success('success', {
            description: data.message
          });
          queryClient.invalidateQueries({
            queryKey: ['project-associated-members']
          });
        },
        onError: (error) => {
          toast.error('Error', {
            description: error.message || 'Failed to change role'
          });
        }
      }
    );
  };

  const handleLeaveOrRemove = (id: string) => {
    leaveOrRemoveMutation.mutate(id, {
      onSuccess: (data) => {
        setOpen(false);
        toast.success('Success', {
          description: data.message
        });
        if (data.data.isSelf) {
          router.push('/project');
        } else {
          queryClient.invalidateQueries({
            queryKey: ['project-associated-members']
          });
        }
      },
      onError: (error) => {
        setOpen(false);
        toast.error('Error', {
          description: error.message
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={
          data.role === ProjectMemberRoleEnum.OWNER ||
          !checkProjectRolePermission(projectRole, 'project:member:edit')
        }
        asChild
        className='data-[disabled]:cursor-not-allowed'
      >
        <Button
          variant='ghost'
          size='icon'
        >
          <MoreHorizontal className='h-4 w-4' />
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
            btnText='Remove'
            confirmFn={() => handleLeaveOrRemove(data._id)}
            isLoading={leaveOrRemoveMutation.isPending}
            disable={
              data.role === ProjectMemberRoleEnum.OWNER ||
              !checkProjectRolePermission(projectRole, 'project:member:delete')
            }
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            disabled={
              !checkProjectRolePermission(projectRole, 'project:member:edit')
            }
          >
            Roles
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={row.getValue('role')}
              onValueChange={(value) =>
                handleRoleChange(value as ProjectMemberRoleEnum)
              }
            >
              {PROJECT_MEMBER_ROLES.filter(
                (role) => role.value !== ProjectMemberRoleEnum.OWNER
              ).map((role, index) => (
                <DropdownMenuRadioItem
                  value={role.value}
                  key={index}
                >
                  {role.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
