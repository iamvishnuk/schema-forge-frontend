'use client';

import { Handle, Node, NodeProps, Position } from '@xyflow/react';
import { Database, Key } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@/lib/utils';

export interface Field {
  id: string;
  name: string;
  type: string;
  required?: boolean;
  isPrimary?: boolean;
  isUnique?: boolean;
  index?: boolean;
  ref?: string;
}

export type CollectionNodeData = Node<{
  label: string;
  description?: string;
  fields: Field[];
  isSelected?: boolean;
}>;

function CollectionNode({ data }: NodeProps<CollectionNodeData>) {
  return (
    <div
      className={cn(
        'min-w-[200px] rounded-md border-2 bg-white px-4 py-2 shadow-md transition-colors duration-200 dark:bg-slate-900',
        data.isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:border-blue-400 dark:ring-blue-800'
          : 'border-stone-200 dark:border-stone-700'
      )}
    >
      <div className='flex items-center'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            data.isSelected
              ? 'bg-blue-100 dark:bg-blue-900'
              : 'bg-stone-100 dark:bg-stone-800'
          )}
        >
          <Database
            className={cn(
              'h-4 w-4',
              data.isSelected
                ? 'text-blue-500 dark:text-blue-300'
                : 'text-stone-500 dark:text-stone-400'
            )}
          />
        </div>
        <div className='ml-2'>
          <div className='text-lg font-bold'>{data.label}</div>
          <div className='text-xs text-gray-500'>Collection</div>
        </div>
      </div>

      <div className='mt-2'>
        {data.fields.map((field, index) => (
          <div
            key={index}
            className='relative flex items-center border-t border-dashed border-stone-200 py-1 text-sm'
          >
            <div className='flex flex-1 items-center'>
              {field.isPrimary && (
                <Key className='mr-1 h-3 w-3 flex-shrink-0 text-amber-500' />
              )}
              <span className='font-medium'>{field.name}</span>
            </div>
            <div className='flex items-center text-xs text-gray-500'>
              <span>{field.type}</span>
              {field.required && (
                <span className='ml-1 text-red-500 italic'>R</span>
              )}
              {field.isUnique && (
                <span className='ml-1 text-blue-500 italic'>U</span>
              )}
              {field.index && (
                <span className='ml-1 text-green-500 italic'>I</span>
              )}
            </div>

            {/* Add connection handles for each field that can be a reference */}
            {field.type === 'ObjectId' && !field.isPrimary && (
              <Handle
                type='source'
                position={Position.Right}
                id={`${field.name}-source`}
                className='h-3 w-3 !bg-blue-500'
                style={{ top: '50%', right: -20 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main connection handles */}
      <Handle
        type='target'
        position={Position.Top}
        className='h-3 w-3 !bg-green-500'
      />
      <Handle
        type='source'
        position={Position.Bottom}
        className='h-3 w-3 !bg-blue-500'
      />
    </div>
  );
}

export default memo(CollectionNode);
