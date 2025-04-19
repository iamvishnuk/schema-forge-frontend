import type { Edge, Node } from '@xyflow/react';

/**
 * Creates a safe copy of a node that can be used for updates without
 * trying to modify read-only properties like width and height
 */
export const createSafeNodeCopy = (node: Node) => {
  // Extract only the properties we want to keep
  const { id, type, position, data } = node;

  // Create a new node object with only the properties we need
  return {
    id,
    type,
    position: { ...position }, // create a new position object
    data: { ...data } // create a new data object
  };
};

/**
 * Creates a safe copy of an edge that can be used for updates
 */
export const createSafeEdgeCopy = (edge: Edge) => {
  // Extract only the properties we want to keep
  const {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    type,
    data,
    style,
    label,
    animated
  } = edge;

  // Create a new edge object with only the properties we need
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    type,
    data: data ? { ...data } : undefined,
    style: style ? { ...style } : undefined,
    label,
    animated
  };
};

/**
 * Safely updates a collection of nodes without modifying read-only properties
 */
export const updateNodeData = (
  nodes: Node[],
  nodeId: string,
  // eslint-disable-next-line no-unused-vars
  updateFn: (data: Record<string, any>) => any
): Node[] => {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        data: updateFn(node.data)
      };
    }
    return node;
  });
};
