import { Node, XYPosition } from '@xyflow/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { TDatabaseTypeValue } from '@/definitions/type';

import { MONGO_DB_ORM_OPTIONS, POSTGRESQL_ORM_OPTIONS } from './constant';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateXYPosition = (nodes: Node[]): XYPosition => {
  // Default node dimensions (approximate size of a collection node)
  const nodeWidth = 280;
  const nodeHeight = 200;
  // Spacing between nodes
  const horizontalSpacing = 50;
  const verticalSpacing = 50;

  // If there are no nodes, return a default position
  if (nodes.length === 0) {
    return {
      x: 100,
      y: 100
    };
  }

  // Create a grid-based system
  const gridCellWidth = nodeWidth + horizontalSpacing;
  const gridCellHeight = nodeHeight + verticalSpacing;

  // Find all occupied positions and calculate the center of mass
  const occupiedPositions: { [key: string]: boolean } = {};
  let totalX = 0;
  let totalY = 0;

  nodes.forEach((node) => {
    // Convert actual positions to grid coordinates
    const gridX = Math.floor(node.position.x / gridCellWidth);
    const gridY = Math.floor(node.position.y / gridCellHeight);

    totalX += gridX;
    totalY += gridY;

    // Mark this position as occupied (no need for large buffer zones)
    occupiedPositions[`${gridX},${gridY}`] = true;
  });

  // Calculate the center of mass of existing nodes (in grid coordinates)
  const centerX = Math.round(totalX / nodes.length);
  const centerY = Math.round(totalY / nodes.length);

  // Start searching from the center of mass
  let gridX = centerX;
  let gridY = centerY;

  // If the center is already occupied, try immediate neighbors first
  if (occupiedPositions[`${gridX},${gridY}`]) {
    // Try adjacent positions first (right, down, left, up)
    const adjacentPositions = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1] // Also try diagonals
    ];

    let found = false;
    for (const [dx, dy] of adjacentPositions) {
      const newX = centerX + dx;
      const newY = centerY + dy;
      if (!occupiedPositions[`${newX},${newY}`]) {
        gridX = newX;
        gridY = newY;
        found = true;
        break;
      }
    }

    // If no adjacent position is available, use spiral search
    if (!found) {
      // Spiral search parameters
      let position = 0;
      const directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1]
      ]; // right, down, left, up
      let directionIndex = 0;
      let steps = 1;
      let stepsTaken = 0;

      // Start at center
      gridX = centerX;
      gridY = centerY;

      // Use a spiral pattern to find an empty spot
      while (occupiedPositions[`${gridX},${gridY}`]) {
        // Move in current direction
        const [dx, dy] = directions[directionIndex];
        gridX += dx;
        gridY += dy;
        stepsTaken++;

        // Check if we need to change direction
        if (stepsTaken === steps) {
          stepsTaken = 0;
          directionIndex = (directionIndex + 1) % 4;

          // Increase steps after completing a half circle
          if (directionIndex % 2 === 0) {
            steps++;
          }
        }

        // Safety check to prevent infinite loops
        position++;
        if (position > 50) {
          // If we've checked too many positions, just return a position with offset
          return {
            x: centerX * gridCellWidth + Math.random() * 300 - 150,
            y: centerY * gridCellHeight + Math.random() * 300 - 150
          };
        }
      }
    }
  }

  // Convert grid coordinates back to actual positions
  // Add a small random offset within the grid cell for natural appearance
  return {
    x: gridX * gridCellWidth + Math.random() * 20,
    y: gridY * gridCellHeight + Math.random() * 20
  };
};

// Create a mapping of database types to their ORM options
const DB_ORM_MAPPING = {
  mongodb: MONGO_DB_ORM_OPTIONS,
  postgresql: POSTGRESQL_ORM_OPTIONS
} as const;

export const getORMTypeByDatabaseType = (dbType: TDatabaseTypeValue) => {
  return DB_ORM_MAPPING[dbType as keyof typeof DB_ORM_MAPPING];
};
