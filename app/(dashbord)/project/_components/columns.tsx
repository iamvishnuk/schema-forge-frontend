'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { ProjectMemberRoleEnum } from '@/definitions/enums';
import { IProjectMemberWithUser } from '@/definitions/interface';

import { RowAction } from './row-action';

export const projectMemberColumns: ColumnDef<IProjectMemberWithUser>[] = [
  {
    id: '#',
    header: ({ column }) => (
      <DataTableColumnHeader
        title='#'
        column={column}
      />
    ),
    cell: ({ row }) => <span>{row.index + 1}</span>
  },
  {
    accessorKey: 'userId.name',
    header: ({ column }) => (
      <DataTableColumnHeader
        title='Name'
        column={column}
      />
    ),
    enableHiding: false
  },
  {
    accessorKey: 'userId.email',
    header: ({ column }) => (
      <DataTableColumnHeader
        title='Email'
        column={column}
      />
    ),
    enableHiding: false
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader
        title='Role'
        column={column}
      />
    ),
    cell: ({ row }) => (
      <>
        {row.getValue('role') === ProjectMemberRoleEnum.OWNER ? (
          <Badge
            variant='default'
            className='rounded-full capitalize'
          >
            {row.getValue('role')}
          </Badge>
        ) : (
          <Badge
            variant='outline'
            className='rounded-full capitalize'
          >
            {row.getValue('role')}
          </Badge>
        )}
      </>
    ),
    enableSorting: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowAction row={row} />
  }
];
