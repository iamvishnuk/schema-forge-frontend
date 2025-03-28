'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { ComponentType } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

export type TFilterOption = {
  filterKey: string;
  filterOptions: {
    label: string;
    value: string;
    icon?: ComponentType<{ className?: string }>;
  }[];
  filterTitle: string;
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterOptions?: TFilterOption[];
  // eslint-disable-next-line no-unused-vars
  setGlobalFilter: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  filterOptions,
  setGlobalFilter
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex items-center justify-between py-4'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filter tasks...'
          onChange={(event) => setGlobalFilter(String(event.target.value))}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {filterOptions?.map((filter) => {
          const column = table.getColumn(filter.filterKey);
          if (!column) return null;

          return (
            <DataTableFacetedFilter
              key={filter.filterKey}
              column={column}
              title={filter.filterTitle}
              options={filter.filterOptions}
            />
          );
        })}

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
