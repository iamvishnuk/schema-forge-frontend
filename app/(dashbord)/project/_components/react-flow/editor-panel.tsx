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

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { toggleSidebar } from '@/features/schema-editor/schemaEditorUI';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { calculateXYPosition } from '@/lib/utils';

type Props = {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nodes: Node[];
  edges: Edge[];
};

const EditorPanel = ({
  toggleFullScreen,
  isFullScreen,
  setNodes,
  nodes
}: Props) => {
  const dispatch = useAppDispatch();

  const addCollectionNode = useCallback(() => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'collection',
      position: calculateXYPosition(nodes),
      data: {
        label: 'schema',
        fields: [
          { name: '_id', type: 'ObjectId', isPrimary: true, required: true }
        ]
      }
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, nodes]);

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
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Collection</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Panel>
  );
};

export default EditorPanel;
