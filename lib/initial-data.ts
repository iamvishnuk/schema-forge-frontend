import { type Edge, MarkerType, type Node } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'collection',
    position: { x: 250, y: 100 },
    data: {
      label: 'users',
      description: 'Collection of users',
      fields: [
        { name: '_id', type: 'ObjectId', isPrimary: true },
        { name: 'username', type: 'String', required: true },
        { name: 'email', type: 'String', required: true },
        { name: 'createdAt', type: 'Date', required: true }
      ]
    }
  },
  {
    id: '2',
    type: 'collection',
    position: { x: 600, y: 100 },
    data: {
      label: 'products',
      fields: [
        { name: '_id', type: 'ObjectId', isPrimary: true },
        { name: 'name', type: 'String', required: true },
        { name: 'price', type: 'Number', required: true },
        { name: 'description', type: 'String' }
      ]
    }
  },
  {
    id: '3',
    type: 'collection',
    position: { x: 400, y: 350 },
    data: {
      label: 'orders',
      fields: [
        { name: '_id', type: 'ObjectId', isPrimary: true, isUnique: true },
        {
          name: 'userId',
          type: 'ObjectId',
          required: true,
          ref: 'users',
          index: true
        },
        { name: 'products', type: 'Array', required: true },
        { name: 'totalAmount', type: 'Number', required: true },
        { name: 'status', type: 'String', required: true }
      ]
    }
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    animated: true,
    label: 'places',
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    label: 'contains',
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  }
];

export const FIELD_TYPES = [
  { value: 'String', label: 'String' },
  { value: 'Number', label: 'Number' },
  { value: 'Boolean', label: 'Boolean' },
  { value: 'Date', label: 'Date' },
  { value: 'ObjectId', label: 'ObjectId' },
  { value: 'Array', label: 'Array' },
  { value: 'Object', label: 'Object' }
];
