'use client';

import { Edge, Node, Panel } from '@xyflow/react';
import {
  FileSpreadsheet,
  Maximize,
  Minimize,
  PanelLeft,
  Save,
  Trash2
} from 'lucide-react';
import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useSocket } from '@/context/socket-provider';
import {
  closeSidebar,
  setSelectedNode,
  toggleSidebar
} from '@/features/schema-editor/schemaEditorUI';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { calculateXYPosition } from '@/lib/utils';

type Props = {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nodes: Node[];
  edges: Edge[];
  projectId: string;
};

const EditorPanel = ({
  toggleFullScreen,
  isFullScreen,
  setNodes,
  nodes,
  projectId
}: Props) => {
  const dispatch = useAppDispatch();
  const { emit, isConnected } = useSocket();
  const selectedNode = useAppSelector(
    (state) => state.schemaEditorUI.selectedNode
  );

  const addCollectionNode = useCallback(() => {
    const newNode: Node = {
      id: uuid(),
      type: 'collection',
      position: calculateXYPosition(nodes),
      data: {
        label: 'schema',
        fields: [
          {
            id: uuid(),
            name: '_id',
            type: 'ObjectId',
            isPrimary: true,
            required: true
          }
        ]
      }
    };

    setNodes((nds) => nds.concat(newNode));

    // Emit event to update other clients
    if (isConnected) {
      console.log('Emitting DIAGRAM:NODE_ADDED event');
      emit('DIAGRAM:NODE_ADDED', {
        projectId,
        node: newNode
      });
    }
  }, [setNodes, nodes, emit, projectId, isConnected]);

  const deleteCollectionNode = useCallback(() => {
    if (!selectedNode) return;
    const updatedNodes = nodes.filter((node) => node.id !== selectedNode.id);
    setNodes(updatedNodes);
    dispatch(setSelectedNode(null));
    dispatch(closeSidebar());

    if (isConnected) {
      console.log('Emitting DIAGRAM:NODE_DELETED event');
      emit('DIAGRAM:NODE_DELETED', { projectId, nodeId: selectedNode.id });
    }
  }, [selectedNode, nodes, setNodes, dispatch, emit, isConnected, projectId]);

  return (
    <Panel
      position='top-left'
      className='flex gap-3'
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => dispatch(toggleSidebar())}
              title='Toggle sidebar'
            >
              <PanelLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle sidebar (ctrl + shift + ?)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={toggleFullScreen}
            >
              {isFullScreen ? (
                <Minimize className='h-4 w-4' />
              ) : (
                <Maximize className='h-4 w-4' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFullScreen ? 'Exit full screen' : 'Enter full screen'}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={addCollectionNode}
            >
              <FileSpreadsheet className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Schema</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
            >
              <Save className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={deleteCollectionNode}
              disabled={!selectedNode}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Schema</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Panel>
  );
};

export default EditorPanel;
