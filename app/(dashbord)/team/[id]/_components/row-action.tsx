import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';

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
import { ITeamMemberWithUser } from '@/definitions/interface';
import { TEAM_ROLES } from '@/lib/constant';

interface DataTableRowActionsProps<TData extends ITeamMemberWithUser> {
  row: Row<TData>;
}

export function RowAction<TData extends ITeamMemberWithUser>({
  row
}: DataTableRowActionsProps<TData>) {
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
            open={false}
            setOpen={(value: boolean) => {
              console.log(value);
            }}
            confirmFn={() => {}}
            isLoading={false}
            btnText='Remove'
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={row.getValue('role')}>
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
