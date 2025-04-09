'use client';
import '@xyflow/react/dist/style.css';

import {
  addEdge,
  Background,
  Connection,
  Controls,
  type Edge,
  MarkerType,
  type Node,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from '@xyflow/react';
import React, { useCallback, useRef, useState } from 'react';

import {
  closeSidebar,
  setSelectedEdge,
  setSelectedNode
} from '@/features/schema-editor/schemaEditorUI';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { cn } from '@/lib/utils';

import EditorPanel from './editor-panel';
import EditorSidebar from './editor-sidebar';
import collectionNode, { CollectionNodeData } from './nodes/collection-node';

type Props = {};

const nodeTypes: NodeTypes = {
  collection: collectionNode
};

const SchemaEditor = ({}: Props) => {
  const dispatch = useAppDispatch();

  const storeEdges = useAppSelector((state) => state.schema.edges);
  const storeNodes = useAppSelector((state) => state.schema.nodes);
  const isSidebarOpen = useAppSelector(
    (state) => state.schemaEditorUI.isSidebarOpen
  );

  const [isFullScreen, setIsFullScreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed
            }
          },
          eds
        )
      ),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      dispatch(setSelectedNode(node as CollectionNodeData));

      // Update nodes to indicate which one is selected
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isSelected: n.id === node.id
          }
        }))
      );
    },
    [setNodes, dispatch]
  );

  // Handle edge selection
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      dispatch(setSelectedEdge(edge));
      // Clear selection state from all nodes
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isSelected: false
          }
        }))
      );
    },
    [setNodes, dispatch]
  );

  // Handle pane click (deselect everything)
  const onPaneClick = useCallback(() => {
    dispatch(setSelectedNode(null));
    dispatch(setSelectedEdge(null));
    dispatch(closeSidebar());

    // Clear selection state from all nodes
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: false
        }
      }))
    );
  }, [setNodes, dispatch]);

  // function to toggle fullscreen editor
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current
        ?.requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          );
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
        })
        .catch((err) => {
          console.error(
            `Error attempting to exit full-screen mode: ${err.message}`
          );
        });
    }
  };

  return (
    <div
      className='flex h-full w-full rounded-lg border shadow-md'
      ref={wrapperRef}
    >
      <div
        className={cn(
          'bg-muted/30 overflow-x-hidden overflow-y-auto border-r transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'min-w-[400px]' : 'w-0'
        )}
      >
        <EditorSidebar
          setEdges={setEdges}
          setNodes={setNodes}
          nodes={nodes}
          edges={edges}
        />
      </div>
      <ReactFlowProvider>
        <ReactFlow
          className='h-full w-full'
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <Controls />
          <Background />
          <EditorPanel
            toggleFullScreen={toggleFullScreen}
            isFullScreen={isFullScreen}
            setNodes={setNodes}
            nodes={nodes}
            setEdges={setEdges}
            edges={edges}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default SchemaEditor;
