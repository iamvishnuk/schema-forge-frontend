import { Node, XYPosition } from '@xyflow/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateXYPosition = (nodes: Node[]): XYPosition => {
  const currentNodePosition = nodes.map((node) => node.position);

  return {
    x:
      Math.max(...currentNodePosition.map((pos) => pos.x)) +
      Math.random() * 200,
    y:
      Math.max(...currentNodePosition.map((pos) => pos.y)) + Math.random() * 200
  };
};
