'use client';

import { ColumnDef } from '@tanstack/react-table';
import { VariantProps } from 'class-variance-authority';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { TeamRoleEnum } from '@/definitions/enums';
import { ITeamMemberWithUser } from '@/definitions/interface';

import { RowAction } from './row-action';

export const teamMemberColumns: ColumnDef<ITeamMemberWithUser>[] = [
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
        title='Member Name'
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
        {row.getValue('role') === TeamRoleEnum.OWNER ? (
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        title='status'
        column={column}
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      const getVariant = (
        status: string
      ): VariantProps<typeof badgeVariants>['variant'] => {
        switch (status) {
          case 'active':
            return 'active';
          case 'pending':
            return 'pending';
          case 'invited':
            return 'invited';
          case 'suspended':
            return 'suspended';
          default:
            return 'default';
        }
      };

      return (
        <Badge
          variant={getVariant(status)}
          className='rounded-full capitalize'
        >
          {status}
        </Badge>
      );
    },
    enableSorting: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowAction row={row} />
  }
];
