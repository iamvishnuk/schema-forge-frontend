'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type Edge, MarkerType, type Node } from '@xyflow/react';
import { FileCode, Key, Trash2, Workflow } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSocket } from '@/context/socket-provider';
import {
  closeSidebar,
  toggleSidebar,
  updateSelectedNode
} from '@/features/schema-editor/schemaEditorUI';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { SchemaPropertyValidation } from '@/validation';

import { MONGO_DATA_TYPES } from './constants';
import { CollectionNodeData, Field } from './nodes/collection-node';

type Props = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nodes: Node[];
  edges: Edge[];
  projectId: string;
};

const EditorSidebar = ({
  nodes,
  setNodes,
  setEdges,
  projectId,
  edges
}: Props) => {
  const dispatch = useAppDispatch();
  const { emit, isConnected } = useSocket();

  const containerRef = useRef<HTMLDivElement>(null);

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
      ref: '',
      arrayType: undefined
    }
  });

  // Watch the type field and arrayType field to identify when a node is selected as array type
  const selectedType = form.watch('type');

  // Function to check if a string is in the list of mongo data types
  const isMongoDataType = (type?: string) => {
    if (!type) return false;
    return MONGO_DATA_TYPES.some((dataType) => dataType.value === type);
  };

  // Create a function to add an edge between nodes when array relationship is defined
  const createRelationshipEdge = (
    sourceNode: CollectionNodeData,
    targetNodeLabel: string,
    fieldName: string
  ) => {
    // Find the target node by label
    const targetNode = nodes.find(
      (node) => node.data.label === targetNodeLabel
    );
    if (!targetNode) return;

    // Create new edge
    const newEdge: Edge = {
      id: uuid(),
      source: sourceNode.id,
      target: targetNode.id,
      sourceHandle: `${fieldName}-source`,
      animated: true,
      type: 'step',
      label: 'Contain Many',
      style: {
        stroke: '#155dfc',
        strokeWidth: 1
      },
      markerEnd: {
        type: MarkerType.ArrowClosed
      }
    };

    // Add the edge
    setEdges((eds) => {
      // Check if an edge already exists between these nodes with the same sourceHandle
      const edgeExists = eds.some(
        (edge) =>
          edge.source === sourceNode.id &&
          edge.target === targetNode.id &&
          edge.sourceHandle === `${fieldName}-source`
      );

      if (edgeExists) return eds;
      return [...eds, newEdge];
    });

    // Emit edge added event to other clients
    if (isConnected) {
      emit('DIAGRAM:EDGE_ADDED', {
        projectId,
        edge: newEdge
      });
    }
  };

  // function to add a new field to the selected node
  const addFieldToNode = (data: z.infer<typeof SchemaPropertyValidation>) => {
    if (!selectedNode) return;

    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        // Create a new field
        const newField = {
          id: uuid(),
          name: data.name,
          type: data.type,
          arrayType: data.type === 'Array' ? data.arrayType : undefined,
          required: data.required,
          isPrimary: data.isPrimary,
          isUnique: data.isUnique,
          index: data.index,
          ref: data.ref
        };

        // Create a completely new node object with the updated fields
        // This approach avoids modifying any read-only properties
        const newNode = {
          ...node,
          data: {
            ...node.data,
            fields: [
              ...(Array.isArray(node.data.fields) ? node.data.fields : []),
              newField
            ]
          }
        };

        // Emit event to update other clients
        if (isConnected) {
          emit('DIAGRAM:ADD_NODE_FIELDS', {
            projectId,
            nodeId: node.id,
            fields: [newField]
          });
        }

        dispatch(updateSelectedNode(newNode as CollectionNodeData));

        // If the field is an array type and arrayType is not a mongo data type,
        // then it's referring to another node - create an edge
        if (
          data.type === 'Array' &&
          data.arrayType &&
          !isMongoDataType(data.arrayType)
        ) {
          createRelationshipEdge(
            newNode as CollectionNodeData,
            data.arrayType,
            data.name
          );
        }

        return newNode;
      }
      return node;
    });

    // Set the updated nodes
    setNodes(updatedNodes);
  };

  // function to change label of the selected node
  const changeSchemaLabel = (name: string) => {
    if (!selectedNode) return;
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            label: name
          }
        };
        dispatch(updateSelectedNode(updatedNode as CollectionNodeData));

        // Emit event to update other clients
        if (isConnected) {
          emit('DIAGRAM:NODE_LABEL_CHANGED', {
            projectId,
            nodeId: node.id,
            label: name
          });
        }

        return updatedNode;
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const changeSchemeDescription = (description: string) => {
    if (!selectedNode) return;
    const updateNodes = nodes.map((node) => {
      if (node.id === selectedNode.id) {
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            description: description
          }
        };
        dispatch(updateSelectedNode(updatedNode as CollectionNodeData));

        // Emit event to update other clients
        if (isConnected) {
          emit('DIAGRAM:NODE_DESCRIPTION_CHANGED', {
            projectId,
            nodeId: node.id,
            description: description
          });
        }

        return updatedNode;
      }
      return node;
    });

    setNodes(updateNodes);
  };

  // function to delete a field from the selected node
  const deleteFieldFromNode = (fieldId: string) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode?.id) {
        const updatedFields = (
          node.data as CollectionNodeData['data']
        ).fields.filter((field: Field) => field.id !== fieldId);
        const updatedNode = {
          ...node,
          data: {
            ...(node.data as CollectionNodeData['data']),
            fields: updatedFields
          }
        };

        dispatch(updateSelectedNode(updatedNode as CollectionNodeData));

        // check if the field is an array type and remove the edge
        if (node.data.fields) {
          const field = (node.data as CollectionNodeData['data']).fields.find(
            (field: Field) => field.id === fieldId
          );
          if (field) {
            const edgeToRemove = edges.find(
              (edge) =>
                edge.source === node.id &&
                edge.sourceHandle === `${field.name}-source`
            );
            if (edgeToRemove) {
              setEdges((eds) =>
                eds.filter((edge) => edge.id !== edgeToRemove.id)
              );
              // Emit event to remove the edge from other clients
              if (isConnected) {
                emit('DIAGRAM:EDGE_DELETED', {
                  projectId,
                  edgeId: edgeToRemove.id
                });
              }
            }
          }
        }

        // Emit delete field event to other clients
        if (isConnected) {
          emit('DIAGRAM:DELETE_NODE_FIELD', {
            projectId,
            nodeId: node.id,
            fieldId
          });
        }
        return updatedNode;
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  const onSubmit = (data: z.infer<typeof SchemaPropertyValidation>) => {
    addFieldToNode(data);
    form.reset({
      name: '',
      type: '',
      required: false,
      isPrimary: false,
      isUnique: false,
      index: false,
      ref: '',
      arrayType: undefined
    });
  };

  return (
    <div className='flex flex-col overflow-hidden p-4'>
      <Tabs
        defaultValue='schemaDetails'
        className='flex h-full flex-col'
      >
        <TabsList className='grid h-10 w-full grid-cols-2 gap-2'>
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

        <TabsContent
          value='schemaDetails'
          className='h-full flex-1 overflow-y-auto'
        >
          {selectedNode ? (
            <div
              className='mt-5'
              ref={containerRef}
            >
              <h3 className='w-full border-b pb-1 font-medium dark:text-white'>
                Schema
              </h3>
              <div className='mt-2 space-y-3'>
                <div className='grid grid-cols-3 gap-2'>
                  <Label>Name</Label>
                  <Input
                    className='col-span-2 focus-visible:border-2 focus-visible:ring-0'
                    value={selectedNode?.data.label}
                    onChange={(e) => changeSchemaLabel(e.target.value)}
                  />
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <Label className='items-start'>Description</Label>
                  <Textarea
                    className='col-span-2 focus-visible:border-2 focus-visible:ring-0'
                    value={selectedNode?.data?.description}
                    onChange={(e) => changeSchemeDescription(e.target.value)}
                  />
                </div>
              </div>
              <h3 className='mt-8 w-full border-b pb-1 font-medium'>
                Properties
              </h3>
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
                              className='w-full focus-visible:border-2 focus-visible:ring-0'
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
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select data type' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent
                              container={containerRef.current || undefined}
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

                    {selectedType === 'Array' && (
                      <FormField
                        control={form.control}
                        name='arrayType'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='gap-1'>
                              Array Type<span className='text-red-500'>*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='Select data type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent
                                container={containerRef.current || undefined}
                              >
                                {[
                                  ...nodes
                                    .filter(
                                      (node) =>
                                        node.data.label !==
                                        selectedNode.data.label
                                    )
                                    .map((node) => {
                                      return {
                                        value: node.data.label as string,
                                        label: node.data.label as string
                                      };
                                    }),
                                  ...MONGO_DATA_TYPES.filter(
                                    (type) => type.value !== 'Array'
                                  )
                                ].map((type, index) => (
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
                    )}

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
                          <FormLabel className='text-xs'>
                            Required
                            <span className='text-xs text-red-500 italic'>
                              R
                            </span>
                          </FormLabel>
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
                          <FormLabel className='text-xs'>
                            Unique
                            <span className='text-xs text-blue-500 italic'>
                              U
                            </span>
                          </FormLabel>
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
                          <FormLabel className='text-xs'>
                            Index
                            <span className='text-xs text-green-500 italic'>
                              I
                            </span>
                          </FormLabel>
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
                      onClick={() => deleteFieldFromNode(field.id)}
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className='mt-10 text-center italic'>
                Please select a node / Schema to view its details.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value='script'
          className='flex-1 overflow-y-auto'
        >
          <div>
            <p className='mt-10 text-center italic'>
              Script Generation is coming soon!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorSidebar;
