import type { Edge, Node } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'collection',
    position: { x: 250, y: 100 },
    data: {
      label: 'User',
      fields: [
        { id: '001', name: '_id', type: 'ObjectId', isPrimary: true },
        {
          id: '002',
          name: 'username',
          type: 'String',
          required: true,
          isUnique: true
        },
        {
          id: '003',
          name: 'email',
          type: 'String',
          required: true,
          isUnique: true,
          index: true
        },
        { id: '004', name: 'password', type: 'String', required: true },
        { id: '005', name: 'phoneNumber', type: 'String', required: true },
        { id: '006', name: 'createdAt', type: 'DateTime' },
        { id: '007', name: 'updatedAt', type: 'DateTime' }
      ]
    }
  },
  {
    id: '2',
    type: 'collection',
    position: { x: 400, y: 300 },
    data: {
      label: 'Post',
      fields: [
        { id: '001', name: '_id', type: 'ObjectId', isPrimary: true },
        { id: '002', name: 'title', type: 'String', required: true },
        { id: '003', name: 'content', type: 'String', required: true },
        {
          id: '004',
          name: 'authorId',
          type: 'ObjectId',
          required: true,
          ref: 'User'
        }
      ]
    }
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    label: 'has many',
    type: 'step',
    style: {
      stroke: '#155dfc'
    }
  }
];
