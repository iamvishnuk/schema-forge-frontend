import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Edge } from '@xyflow/react';

import { CollectionNodeData } from '@/app/(dashbord)/project/_components/react-flow/nodes/collection-node';

interface SchemaEditorUIState {
  isSidebarOpen: boolean;
  selectedNode: CollectionNodeData | null;
  selectedEdge: Edge | null;
}

const initialState: SchemaEditorUIState = {
  isSidebarOpen: false,
  selectedEdge: null,
  selectedNode: null
};

const schemaEditorUISlice = createSlice({
  name: 'schemaEditorUI',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    setSelectedNode: (
      state,
      action: PayloadAction<CollectionNodeData | null>
    ) => {
      state.selectedNode = action.payload;
      state.isSidebarOpen = true;
      if (action.payload) {
        state.selectedEdge = null;
      }
    },
    setSelectedEdge: (state, action: PayloadAction<Edge | null>) => {
      state.selectedEdge = action.payload;
      if (action.payload) {
        state.selectedNode = null;
      }
    },
    updateSelectedNode: (state, action: PayloadAction<CollectionNodeData>) => {
      if (state.selectedNode) {
        state.selectedNode = {
          ...state.selectedNode,
          data: {
            ...state.selectedNode.data,
            ...action.payload.data
          }
        };
      }
    }
  }
});
export const {
  toggleSidebar,
  closeSidebar,
  openSidebar,
  setSelectedEdge,
  setSelectedNode,
  updateSelectedNode
} = schemaEditorUISlice.actions;
export default schemaEditorUISlice.reducer;
