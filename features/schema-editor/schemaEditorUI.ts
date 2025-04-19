import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Edge } from '@xyflow/react';

import { CollectionNodeData } from '@/app/(dashbord)/project/_components/react-flow/nodes/collection-node';

interface SchemaEditorUIState {
  isSidebarOpen: boolean;
  isEdgeSidebarOpen: boolean;
  selectedNode: CollectionNodeData | null;
  selectedEdge: Edge | null;
}

const initialState: SchemaEditorUIState = {
  isSidebarOpen: false,
  isEdgeSidebarOpen: false,
  selectedEdge: null,
  selectedNode: null
};

const schemaEditorUISlice = createSlice({
  name: 'schemaEditorUI',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      if (state.isEdgeSidebarOpen) state.isEdgeSidebarOpen = false;
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    openSidebar: (state) => {
      if (state.isEdgeSidebarOpen) state.isEdgeSidebarOpen = false;
      state.isSidebarOpen = true;
    },
    toggleEdgeSidebar: (state) => {
      if (state.isSidebarOpen) state.isSidebarOpen = false;
      state.isEdgeSidebarOpen = !state.isEdgeSidebarOpen;
    },
    closeEdgeSidebar: (state) => {
      state.isEdgeSidebarOpen = false;
    },
    openEdgeSidebar: (state) => {
      if (state.isSidebarOpen) state.isSidebarOpen = false;
      state.isEdgeSidebarOpen = true;
    },
    setSelectedNode: (
      state,
      action: PayloadAction<CollectionNodeData | null>
    ) => {
      state.selectedNode = action.payload;

      if (action.payload) {
        state.selectedEdge = null;
        state.isEdgeSidebarOpen = false;
        state.isSidebarOpen = true;
      } else {
        state.isSidebarOpen = false;
      }
    },
    setSelectedEdge: (state, action: PayloadAction<Edge | null>) => {
      state.selectedEdge = action.payload;

      if (action.payload) {
        state.selectedNode = null;
        state.isSidebarOpen = false;
        state.isEdgeSidebarOpen = true;
      } else {
        state.isEdgeSidebarOpen = false;
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
    },
    updateSelectedEdge: (state, action: PayloadAction<Edge>) => {
      if (state.selectedEdge) {
        state.selectedEdge = {
          ...state.selectedEdge,
          ...action.payload
        };
      }
    }
  }
});
export const {
  toggleSidebar,
  closeSidebar,
  openSidebar,
  toggleEdgeSidebar,
  closeEdgeSidebar,
  openEdgeSidebar,
  setSelectedEdge,
  setSelectedNode,
  updateSelectedNode,
  updateSelectedEdge
} = schemaEditorUISlice.actions;
export default schemaEditorUISlice.reducer;
