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
import { toast } from 'sonner';

import { useAuthContext } from '@/context/auth-provider';
import { useSocket } from '@/context/socket-provider';
import {
  closeSidebar,
  setSelectedEdge,
  setSelectedNode,
  updateSelectedNode
} from '@/features/schema-editor/schemaEditorUI';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { createSafeEdgeCopy, createSafeNodeCopy } from '@/lib/node-utils';
import { cn } from '@/lib/utils';

import ConnectedUsers from '../ConnectedUsers';
import EditorPanel from './editor-panel';
import EditorSidebar from './editor-sidebar';
import collectionNode, {
  CollectionNodeData,
  Field
} from './nodes/collection-node';

// Define empty initial states
const emptyNodes: Node[] = [];
const emptyEdges: Edge[] = [];

type Props = { id: string };

const nodeTypes: NodeTypes = {
  collection: collectionNode
};

const SchemaEditor = ({ id }: Props) => {
  const dispatch = useAppDispatch();
  const { socket, emit, isConnected } = useSocket();
  const { user } = useAuthContext();

  const selectedNode = useAppSelector(
    (state) => state.schemaEditorUI.selectedNode
  );

  // Join project when socket connects
  useEffect(() => {
    if (!socket || !isConnected || !user) return;

    console.log('Emitting PROJECT:JOIN event');
    emit('PROJECT:JOIN', { projectId: id, userName: user?.name });
  }, [socket, isConnected, id, user, emit]);

  const isSidebarOpen = useAppSelector(
    (state) => state.schemaEditorUI.isSidebarOpen
  );

  const [isFullScreen, setIsFullScreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);

  // Listen for initial diagram data
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleInitialDiagram = (data: { Nodes: Node[]; Edges: Edge[] }) => {
      try {
        if (data.Nodes && Array.isArray(data.Nodes)) {
          setNodes(data.Nodes);
        }
        if (data.Edges && Array.isArray(data.Edges)) {
          setEdges(data.Edges);
        }
      } catch {
        toast.error('Something went wrong', {
          description: 'Failed to load diagram data, Please try again'
        });
      }
    };

    socket.on('DIAGRAM:INITIAL', handleInitialDiagram);

    return () => {
      socket.off('DIAGRAM:INITIAL', handleInitialDiagram);
    };
  }, [socket, isConnected, id, setNodes, setEdges]);

  // Listen for node additions from other clients
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNodeAdded = (data: Node) => {
      try {
        if (data) {
          setNodes((nds) => nds.concat(data));
        }
      } catch {
        toast.error('Failed to add new node from another user');
      }
    };

    socket.on('DIAGRAM:NODE_ADDED', handleNodeAdded);

    return () => {
      socket.off('DIAGRAM:NODE_ADDED', handleNodeAdded);
    };
  }, [socket, isConnected, setNodes]);

  // Listen for node deletion from other clients
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNodeDeleted = (data: { nodeId: string }) => {
      try {
        if (data.nodeId) {
          setNodes((nds) => nds.filter((node) => node.id !== data.nodeId));
        }
      } catch {
        toast.error('Failed to delete node from another user');
      }
    };

    socket.on('DIAGRAM:NODE_DELETED', handleNodeDeleted);

    return () => {
      socket.off('DIAGRAM:NODE_DELETED', handleNodeDeleted);
    };
  }, [socket, isConnected, setNodes]);

  // Listen for node label changes from other clients
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNodeLabelChanged = (data: {
      nodeId: string;
      label: string;
    }) => {
      if (data.nodeId) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === data.nodeId
              ? {
                  ...node,
                  data: {
                    ...(node.data as CollectionNodeData['data']),
                    label: data.label
                  }
                }
              : node
          )
        );
      }
    };

    socket.on('DIAGRAM:NODE_LABEL_CHANGED', handleNodeLabelChanged);

    return () => {
      socket.off('DIAGRAM:NODE_LABEL_CHANGED', handleNodeLabelChanged);
    };
  }, [socket, isConnected, setNodes]);

  // Listen for node description changes from other clients
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNodeDescriptionChanged = (data: {
      nodeId: string;
      description: string;
    }) => {
      if (data.nodeId) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === data.nodeId
              ? {
                  ...node,
                  data: {
                    ...(node.data as CollectionNodeData['data']),
                    description: data.description
                  }
                }
              : node
          )
        );
      }
    };

    socket.on('DIAGRAM:NODE_DESCRIPTION_CHANGED', handleNodeDescriptionChanged);

    return () => {
      socket.off(
        'DIAGRAM:NODE_DESCRIPTION_CHANGED',
        handleNodeDescriptionChanged
      );
    };
  }, [socket, isConnected, setNodes]);

  // Listen for new fields to be added to a node from other clients
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNodeFieldsAdded = (data: {
      nodeId: string;
      fields: Field[];
    }) => {
      if (data.nodeId) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === data.nodeId
              ? {
                  ...node,
                  data: {
                    ...(node.data as CollectionNodeData['data']),
                    fields: [
                      ...(node.data as CollectionNodeData['data']).fields,
                      ...data.fields
                    ]
                  }
                }
              : node
          )
        );
      }
    };

    socket.on('DIAGRAM:ADD_NODE_FIELDS', handleNodeFieldsAdded);

    return () => {
      socket.off('DIAGRAM:ADD_NODE_FIELDS', handleNodeFieldsAdded);
    };
  }, [socket, isConnected, setNodes]);

  // Listen for fields to be deleted from a node from other clients
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNodeFieldsDeleted = (data: {
      nodeId: string;
      fieldId: string;
    }) => {
      if (data.nodeId) {
        const updatedNodes = nodes.map((node) =>
          node.id === data.nodeId
            ? {
                ...node,
                data: {
                  ...(node.data as CollectionNodeData['data']),
                  fields: (
                    node.data as CollectionNodeData['data']
                  ).fields.filter((field: Field) => field.id !== data.fieldId)
                }
              }
            : node
        );

        setNodes(updatedNodes);

        // If a user had selected that node, update the selected node too
        if (selectedNode?.id === data.nodeId) {
          dispatch(
            updateSelectedNode(
              updatedNodes.find(
                (n) => n.id === data.nodeId
              ) as CollectionNodeData
            )
          );
        }
      }
    };

    socket.on('DIAGRAM:DELETE_NODE_FIELD', handleNodeFieldsDeleted);

    return () => {
      socket.off('DIAGRAM:DELETE_NODE_FIELD', handleNodeFieldsDeleted);
    };
  }, [socket, isConnected, nodes, setNodes, selectedNode, dispatch]);

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

  console.log('isSidebarOpen', isSidebarOpen);

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
          projectId={id}
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
            projectId={id}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default SchemaEditor;
