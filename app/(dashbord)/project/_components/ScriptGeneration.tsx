'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Code,
  Code2,
  Database,
  FileText,
  Key,
  Loader,
  Settings
} from 'lucide-react';
import React, { useState } from 'react';

import CodeEditor from '@/components/CodeEditor';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  generateCodeMutationFn,
  getProjectTablesOrCollectionsMutationFn,
  getSelectCollectionOrTableMutationFn
} from '@/lib/api';
import { getORMTypeByDatabaseType } from '@/lib/utils';

type Props = {
  projectId: string;
};

const ScriptGeneration = ({ projectId }: Props) => {
  const { project } = useAppSelector((state) => state.project);

  const [selectedORM, setSelectedORM] = useState<string | undefined>(undefined);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(
    undefined
  );

  console.log('selectedNodeId', selectedNodeId);

  const { data } = useQuery({
    queryKey: ['project-collections-or-tables', projectId],
    queryFn: () => getProjectTablesOrCollectionsMutationFn(projectId)
  });
  const collectionsOrTables = data?.data || [];

  const { data: selectedNodeData } = useQuery({
    queryKey: ['selected-node', selectedNodeId, selectedORM, projectId],
    queryFn: () => {
      if (selectedNodeId && projectId && selectedORM) {
        return getSelectCollectionOrTableMutationFn(projectId, selectedNodeId);
      }
    },
    enabled: !!selectedNodeId && !!projectId && !!selectedORM
  });

  const {
    data: generateCodeRes,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['geneated-code', selectedNodeId, selectedORM, projectId],
    queryFn: () => {
      if (selectedNodeId && projectId && selectedORM) {
        return generateCodeMutationFn(projectId, selectedNodeId, selectedORM);
      }
    },
    enabled: false
  });

  const generatedCode = generateCodeRes?.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Code2 />
          Script Generation
        </CardTitle>
        <CardDescription>
          Generate database scripts based on your schema design
        </CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Script Configuration
            </CardTitle>
            <CardDescription className='text-gray-400'>
              Choose the type of script you want to generate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='w-full space-y-6'>
              <div className='space-y-2'>
                <Label>Select ORM library for your project</Label>
                <Select onValueChange={(value) => setSelectedORM(value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent>
                    {getORMTypeByDatabaseType(project?.databaseType!).map(
                      (orm, index) => (
                        <SelectItem
                          key={index}
                          value={orm.value}
                          disabled={orm.disabled}
                        >
                          <orm.icon className='mr-2 h-4 w-4' />
                          {orm.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Select collection / table</Label>
                <Select onValueChange={(value) => setSelectedNodeId(value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionsOrTables.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item.id}
                        className='capitalize'
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedNodeData && (
              <>
                <div className='mt-6 rounded-md border p-4 shadow-lg'>
                  <div className='flex items-center'>
                    <Database className='text-stone-500 dark:text-blue-500' />
                    <p className='ml-3 font-medium'>
                      {selectedNodeData?.data.data.label}
                    </p>
                  </div>
                  <div className='mt-2'>
                    {selectedNodeData?.data.data.fields.map((field, index) => (
                      <div
                        key={index}
                        className='relative flex items-center border-t border-dashed border-stone-500 py-2 text-sm'
                      >
                        <div className='flex flex-1 items-center'>
                          {field.isPrimary && (
                            <Key className='mr-1 h-3 w-3 flex-shrink-0 text-amber-500' />
                          )}
                          <span className='font-medium'>{field.name}</span>
                        </div>
                        <div className='flex items-center text-xs text-gray-500'>
                          {field.type === 'Array' ? (
                            <span>
                              [<span className='italic'>{field.arrayType}</span>{' '}
                              ]
                            </span>
                          ) : (
                            <span>{field.type}</span>
                          )}

                          {field.required && (
                            <span className='ml-1 text-red-500 italic'>R</span>
                          )}
                          {field.isUnique && (
                            <span className='ml-1 text-blue-500 italic'>U</span>
                          )}
                          {field.index && (
                            <span className='ml-1 text-green-500 italic'>
                              I
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className='mt-6'>
                  <Button
                    className='w-full bg-blue-500 text-white hover:bg-blue-600'
                    onClick={() => refetch()}
                  >
                    <Code /> Generate Script{' '}
                    {isFetching && <Loader className='animate-spin' />}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-5 w-5' />
              Generated Script
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedCode && <CodeEditor code={generatedCode} />}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ScriptGeneration;
