'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader, PlusCircle } from 'lucide-react';
import React, { useEffect } from 'react';
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
import MultipleSelector from '@/components/ui/multiple-selector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProjectTemplateEnum } from '@/definitions/enums';
import { IProject } from '@/definitions/interface';
import { createProjectMutationFn, updateProjectMutationFn } from '@/lib/api';
import {
  DATABASE_TYPE_OPTIONS,
  PROJECT_TEMPLATES_OPTIONS
} from '@/lib/constant';
import { CreateProjectSchema } from '@/validation';

type Props = {
  open: boolean;
  btnText: string;
  isEdit?: boolean;
  projectData?: IProject | null;
  // eslint-disable-next-line no-unused-vars
  setOpen: (value: boolean) => void;
};

const ProjectFrom = ({
  open,
  setOpen,
  btnText,
  isEdit,
  projectData
}: Props) => {
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: createProjectMutationFn
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProjectMutationFn
  });

  const form = useForm<z.infer<typeof CreateProjectSchema>>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      name: '',
      description: '',
      databaseType: undefined,
      tag: [],
      connectionString: '',
      templateType: ProjectTemplateEnum.NONE
    }
  });

  // Update form values when data changes
  useEffect(() => {
    if (projectData) {
      form.reset({
        name: projectData?.name,
        description: projectData?.description,
        databaseType: projectData?.databaseType,
        connectionString: projectData?.connectionString,
        tag: projectData?.tag,
        templateType: projectData?.templateType
      });
    } else {
      form.reset({
        name: '',
        description: '',
        databaseType: undefined,
        tag: [],
        connectionString: '',
        templateType: ProjectTemplateEnum.NONE
      });
    }
  }, [projectData, form]);

  const onSubmit = (values: z.infer<typeof CreateProjectSchema>) => {
    if (isEdit) {
      updateProjectMutation.mutate(
        { ...values, projectId: projectData?._id! },
        {
          onSuccess: () => {
            toast.success('Project updated successfully', {
              description: 'Your project has been updated successfully.'
            });
            queryClient.invalidateQueries({
              queryKey: ['get-projects']
            });
            setOpen(false);
            form.reset();
          },
          onError: (error) => {
            toast.error('Error', { description: error.message });
          }
        }
      );
    } else {
      createProjectMutation.mutate(values, {
        onSuccess: () => {
          toast.success('Project created successfully', {
            description: 'Your project has been created successfully.'
          });
          queryClient.invalidateQueries({
            queryKey: ['get-projects']
          });
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast.error('Error', { description: error.message });
        }
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button className='bg-blue-600 hover:cursor-pointer hover:bg-blue-700 dark:text-white'>
          <PlusCircle className='mr-2 h-4 w-4' />
          {btnText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Update project' : 'Create a new project'}
          </DialogTitle>
          <DialogDescription>
            Create a new project and build your schema efficiently.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-5'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='gap-1'>
                    Name<span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter project name'
                      {...field}
                      disabled={createProjectMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Project description (optional)'
                      rows={3}
                      {...field}
                      disabled={createProjectMutation.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='templateType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Template</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={createProjectMutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select project template (Optional)' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROJECT_TEMPLATES_OPTIONS.map((template, index) => (
                        <SelectItem
                          key={index}
                          value={template.value}
                        >
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='databaseType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='gap-1'>
                    Database Type <span className='text-red-500'>*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={createProjectMutation.isPending || isEdit}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select database type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DATABASE_TYPE_OPTIONS.map((type, index) => (
                        <SelectItem
                          key={index}
                          value={type.value}
                          disabled={type.disabled}
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
              name='tag'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      creatable
                      placeholder='Type something and press enter (optional)'
                      onChange={(value) => {
                        field.onChange(value.map((item) => item.value));
                      }}
                      options={[]}
                      disabled={createProjectMutation.isPending}
                      value={form
                        .getValues('tag')
                        .map((tag) => ({ label: tag, value: tag }))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='connectionString'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter connection URL (optional)'
                      {...field}
                      disabled={createProjectMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant='destructive'
                type='button'
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
                className='hover:cursor-pointer dark:bg-red-600 dark:hover:bg-red-700'
              >
                Cancel
              </Button>
              <Button
                className='bg-blue-600 hover:cursor-pointer hover:bg-blue-700 dark:text-white'
                type='submit'
              >
                {createProjectMutation.isPending && (
                  <Loader className='animate-spin' />
                )}
                {isEdit ? 'Update Project' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFrom;
