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
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useAuthContext } from '@/context/auth-provider';
import { useSocket } from '@/context/socket-provider';
import {
  closeSidebar,
  setSelectedEdge,
  setSelectedNode
} from '@/features/schema-editor/schemaEditorUI';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { initialEdges, initialNodes } from '@/lib/initial-data';
import { createSafeEdgeCopy, createSafeNodeCopy } from '@/lib/node-utils';
import { cn } from '@/lib/utils';

import ConnectedUsers from '../ConnectedUsers';
import EditorPanel from './editor-panel';
import EditorSidebar from './editor-sidebar';
import collectionNode, { CollectionNodeData } from './nodes/collection-node';

type Props = { id: string };

const nodeTypes: NodeTypes = {
  collection: collectionNode
};

const SchemaEditor = ({ id }: Props) => {
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const { user } = useAuthContext();

  useEffect(() => {
    if (socket && user) {
      socket.emit('PROJECT:JOIN', { projectId: id, userName: user?.name });
    }
  }, [socket, id, user]);

  const isSidebarOpen = useAppSelector(
    (state) => state.schemaEditorUI.isSidebarOpen
  );

  const [isFullScreen, setIsFullScreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            type: 'step',
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
      // Use a safe approach to clone the node without read-only properties
      const nodeToSelect = createSafeNodeCopy(node);

      dispatch(setSelectedNode(nodeToSelect as CollectionNodeData));

      // Update nodes to indicate which one is selected - ensure proper immutability
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
    [dispatch, setNodes]
  );

  // Handle edge selection
  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      // Create a clean copy of the edge without potential read-only properties
      const edgeToSelect = createSafeEdgeCopy(edge);

      dispatch(setSelectedEdge(edgeToSelect));

      // Clear selection state from all nodes - ensure proper immutability
      setNodes((prevNodes) =>
        prevNodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isSelected: false
          }
        }))
      );
    },
    [dispatch, setNodes]
  );

  // Handle pane click (deselect everything)
  const onPaneClick = useCallback(() => {
    dispatch(setSelectedNode(null));
    dispatch(setSelectedEdge(null));
    dispatch(closeSidebar());

    // Clear selection state from all nodes - ensure proper immutability
    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: false
        }
      }))
    );
  }, [dispatch, setNodes]);

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
      className='relative flex h-[calc(100vh-220px)] w-full rounded-lg border shadow-md'
      ref={wrapperRef}
    >
      <div
        className={cn(
          'bg-muted/30 h-full overflow-x-hidden border-r transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'min-w-[400px]' : 'w-0'
        )}
      >
        <ConnectedUsers className='absolute top-4 right-4' />
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
          attributionPosition='bottom-right'
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
