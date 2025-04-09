import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Edge, Node } from '@xyflow/react';

import { initialEdges, initialNodes } from '@/lib/initial-data';

export interface Field {
  name: string;
  type: string;
  required?: boolean;
  isPrimary?: boolean;
  ref?: string;
}

export interface SchemaState {
  nodes: Node[];
  edges: Edge[];
}

const initialState: SchemaState = {
  nodes: initialNodes,
  edges: initialEdges
};

export const schemaSlice = createSlice({
  name: 'schema',
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
    }
  }
});

export const { setNodes, setEdges, addNode } = schemaSlice.actions;

export default schemaSlice.reducer;
