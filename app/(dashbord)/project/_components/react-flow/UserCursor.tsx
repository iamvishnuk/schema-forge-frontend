'use client';

import { useReactFlow } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import React from 'react';

interface UserCursorProps {
  userName: string;
  position: { x: number; y: number };
  color: string;
}

const UserCursor: React.FC<UserCursorProps> = ({
  userName,
  position,
  color
}) => {
  // Get the current zoom level and viewport position from ReactFlow
  const { getZoom, getViewport } = useReactFlow();
  const zoom = getZoom();
  const viewport = getViewport();

  // State to store the ReactFlow container element
  const [flowContainer, setFlowContainer] = useState<HTMLElement | null>(null);

  // Get the ReactFlow container element on component mount
  useEffect(() => {
    // Find the ReactFlow container element which has the "react-flow" class
    const container = document.querySelector('.react-flow') as HTMLElement;
    if (container) {
      setFlowContainer(container);
    }
  }, []);

  // Calculate the transformed position based on the current viewport and zoom
  const getTransformedPosition = useCallback(() => {
    if (!flowContainer) return { x: 0, y: 0 };

    // Get the bounding rect of the ReactFlow container
    const rect = flowContainer.getBoundingClientRect();

    // First convert the flow coordinates to screen coordinates
    // The formula is: screenCoord = (flowCoord * zoom) + panOffset
    const screenX = position.x * zoom + viewport.x;
    const screenY = position.y * zoom + viewport.y;

    // Then adjust for the container's position in the DOM
    // This accounts for any margins, paddings, or positioning of the flow container
    const finalX = screenX + rect.left;
    const finalY = screenY + rect.top;

    // Make sure cursor stays within bounds of ReactFlow container
    const boundedX = Math.max(0, Math.min(finalX, rect.width + rect.left));
    const boundedY = Math.max(0, Math.min(finalY, rect.height + rect.top));

    // Calculate position relative to the viewport
    // This is what we need for absolute positioning with CSS
    const viewportX = boundedX - window.scrollX;
    const viewportY = boundedY - window.scrollY;

    return { x: viewportX, y: viewportY };
  }, [flowContainer, position.x, position.y, viewport.x, viewport.y, zoom]);

  // Get the transformed position
  const { x: transformedX, y: transformedY } = getTransformedPosition();

  // Don't render the cursor if we don't have the flow container yet
  if (!flowContainer) return null;

  return (
    <motion.div
      className='pointer-events-none fixed z-[100]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
        left: 0,
        top: 0,
        transform: `translate(${transformedX}px, ${transformedY}px)`
      }}
    >
      {/* Cursor icon */}
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        style={{ color }}
      >
        <path
          d='M5.0833 18.9167L5.08332 5.08334L18.9166 12.6667L9.91665 14.0833L5.0833 18.9167Z'
          fill='currentColor'
          stroke='white'
          strokeWidth='1.5'
          strokeLinejoin='round'
        />
      </svg>

      {/* Username label */}
      <div
        className='absolute top-0 left-6 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap'
        style={{
          backgroundColor: color,
          color: '#fff'
        }}
      >
        {userName}
      </div>
    </motion.div>
  );
};

export default UserCursor;
