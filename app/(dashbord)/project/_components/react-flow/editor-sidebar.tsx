'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type Edge, type Node } from '@xyflow/react';
import { FileCode, Key, Trash2, Workflow } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  closeSidebar,
  toggleSidebar
} from '@/features/schema-editor/schemaEditorUI';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { SchemaPropertyValidation } from '@/validation';

import { MONGO_DATA_TYPES } from './constants';

type Props = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nodes: Node[];
  edges: Edge[];
};

const EditorSidebar = ({}: Props) => {
  const dispatch = useAppDispatch();

  const selectedNode = useAppSelector(
    (state) => state.schemaEditorUI.selectedNode
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(closeSidebar());
      }
      // Handle the ctrl + shift + ? event to toggle sidebar
      if (event.ctrlKey && event.shiftKey && event.key === '?') {
        dispatch(toggleSidebar());
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  const form = useForm<z.infer<typeof SchemaPropertyValidation>>({
    resolver: zodResolver(SchemaPropertyValidation),
    defaultValues: {
      name: '',
      type: undefined,
      required: false,
      isPrimary: false,
      isUnique: false,
      index: false,
      ref: ''
    }
  });

  const onSubmit = (data: z.infer<typeof SchemaPropertyValidation>) => {
    console.log('data', data);
    form.reset();
  };

  return (
    <div className='h-full p-4'>
      <Tabs
        defaultValue='schemaDetails'
        className=''
      >
        <TabsList className='grid w-full grid-cols-2 gap-2'>
          <TabsTrigger
            value='schemaDetails'
            className='w-full'
          >
            <Workflow />
            Schema Details
          </TabsTrigger>
          <TabsTrigger
            value='script'
            className='w-full'
          >
            <FileCode />
            Script
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {selectedNode && (
        <div className='mt-5'>
          <h3 className='w-full border-b pb-1 font-medium dark:text-white'>
            Schema
          </h3>
          <div className='mt-2 space-y-3'>
            <div className='grid grid-cols-3 gap-2'>
              <Label>Name</Label>
              <Input
                className='col-span-2'
                value={selectedNode?.data.label}
                onChange={() => {}}
              />
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <Label className='items-start'>Description</Label>
              <Textarea
                className='col-span-2'
                value={selectedNode?.data?.description}
                onChange={() => {}}
              />
            </div>
          </div>
          <h3 className='mt-8 w-full border-b pb-1 font-medium'>Properties</h3>
          <div className='mt-3 space-y-3'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-3'
              >
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='gap-1'>
                        Property Name<span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Property name'
                          className='w-full'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='gap-1'>
                        Data type<span className='text-red-500'>*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select data type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position='popper'
                          sideOffset={5}
                          className='z-[9999]'
                        >
                          {MONGO_DATA_TYPES.map((type, index) => (
                            <SelectItem
                              key={index}
                              value={type.value}
                            >
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='required'
                  render={({ field }) => (
                    <FormItem className='pace-x-1 flex flex-row items-start'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='text-xs'>Required</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='isUnique'
                  render={({ field }) => (
                    <FormItem className='pace-x-1 flex flex-row items-start'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='text-xs'>Unique</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='index'
                  render={({ field }) => (
                    <FormItem className='pace-x-1 flex flex-row items-start'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='text-xs'>Index</FormLabel>
                    </FormItem>
                  )}
                />
                <Button className='w-full bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600'>
                  Add
                </Button>
              </form>
            </Form>
          </div>
          <Separator className='my-2' />
          <div className='space-y-1'>
            {selectedNode.data.fields.map((field: any, index: number) => (
              <div
                key={index}
                className='bg-background flex items-center justify-between rounded p-2 text-sm'
              >
                <div className='flex items-center gap-1'>
                  <span className='font-medium'>{field.name}</span>
                  <span className='text-muted-foreground ml-2 text-xs'>
                    {field.type}
                  </span>
                  {field.isPrimary && (
                    <Key className='mr-1 h-3 w-3 flex-shrink-0 text-amber-500' />
                  )}
                  {field.required && (
                    <span className='text-xs text-red-500 italic'>R</span>
                  )}
                  {field.isUnique && (
                    <span className='text-xs text-blue-500 italic'>U</span>
                  )}
                  {field.index && (
                    <span className='text-xs text-green-500 italic'>I</span>
                  )}
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6'
                  disabled={field.isPrimary}
                >
                  <Trash2 className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorSidebar;
