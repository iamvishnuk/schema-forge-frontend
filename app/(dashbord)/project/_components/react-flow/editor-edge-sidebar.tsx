import { type Edge, type Node } from '@xyflow/react';
import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
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
import { Slider } from '@/components/ui/slider';
import { useSocket } from '@/context/socket-provider';
import { updateSelectedEdge } from '@/features/schema-editor/schemaEditorUI';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

import { EDGE_TYPES } from './constants';
type Props = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nodes: Node[];
  edges: Edge[];
  projectId: string;
};

const EditorEdgeSideBar = ({ edges, setEdges, projectId }: Props) => {
  const dispatch = useAppDispatch();

  const { isConnected, emit } = useSocket();

  const selectedEdge = useAppSelector(
    (state) => state.schemaEditorUI.selectedEdge
  );

  const changeProperty = (property: string, value: any) => {
    if (!selectedEdge) return;
    const updateEdges = edges.map((edge) => {
      if (edge.id === selectedEdge.id) {
        let updatedEdge;
        // For label property, ensure we're not creating new key-pairs
        if (property === 'label') {
          updatedEdge = {
            ...edge,
            label: value // Explicitly update the label property
          };
        }

        // Handle other properties normally
        updatedEdge = {
          ...edge,
          [property]: value
        };

        dispatch(updateSelectedEdge(updatedEdge));

        if (isConnected) {
          emit('DIAGRAM:EDGE_UPDATE', {
            projectId: projectId,
            edgeId: selectedEdge.id,
            property,
            value
          });
        }

        return updatedEdge;
      }
      return edge;
    });

    setEdges(updateEdges);
  };

  return (
    <div className='flex flex-col overflow-hidden p-4'>
      <h3>Relation Details</h3>
      <Separator className='my-2' />
      <div className='space-y-4'>
        <div className='space-y-1.5'>
          <Label>Label</Label>
          <Input
            type='text'
            className='focus-visible:border-2 focus-visible:ring-0'
            value={selectedEdge?.label ? String(selectedEdge.label) : ''}
            onChange={(e) => {
              changeProperty('label', e.target.value);
            }}
          />
        </div>
        <div className='w-full space-y-1.5'>
          <Label>Edge Type</Label>
          <Select
            value={selectedEdge?.type || ''}
            onValueChange={(value) => {
              changeProperty('type', value);
            }}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Select a label' />
            </SelectTrigger>
            <SelectContent>
              {EDGE_TYPES.map((edgeType, index) => (
                <SelectItem
                  value={edgeType.value}
                  key={index}
                >
                  {edgeType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-full items-center gap-2'>
          <Checkbox
            checked={selectedEdge?.animated}
            onCheckedChange={(value) => {
              changeProperty('animated', value);
            }}
          />
          <Label>Animated</Label>
        </div>
      </div>
      <Separator className='my-2' />
      <div className='space-y-4'>
        <div className='flex w-full items-center justify-between space-y-1.5'>
          <Label>Stroke Color</Label>
          <Input
            type='color'
            value={selectedEdge?.style?.stroke || '#000000'}
            className='w-20'
            onChange={(e) => {
              changeProperty('style', {
                ...(selectedEdge?.style || {}),
                stroke: e.target.value
              });
            }}
          />
        </div>
        <div className='w-full space-y-1.5'>
          <Label>
            Stroke Width (<span>{selectedEdge?.style?.strokeWidth}</span>)
          </Label>
          <Slider
            className='mt-2'
            defaultValue={[Number(selectedEdge?.style?.strokeWidth) * 10 || 10]}
            max={100}
            step={10}
            min={10}
            onValueChange={(value) => {
              changeProperty('style', {
                ...(selectedEdge?.style || {}),
                strokeWidth: value[0] / 10
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorEdgeSideBar;
