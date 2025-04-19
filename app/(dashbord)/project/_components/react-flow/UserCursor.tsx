'use client';

import { useReactFlow } from '@xyflow/react';
import { motion } from 'framer-motion';
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

  // Transform the position based on the zoom level and viewport
  const transformedX = (position.x - viewport.x) * zoom;
  const transformedY = (position.y - viewport.y) * zoom;

  return (
    <motion.div
      className='pointer-events-none absolute z-[100]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      style={{
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
