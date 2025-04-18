'use client';

import React, { useEffect, useState } from 'react';

import { useAuthContext } from '@/context/auth-provider';
import { useSocket } from '@/context/socket-provider';

import UserCursor from './UserCursor';

interface User {
  userId: string;
  userName: string;
  position: { x: number; y: number };
}

interface RemoteCursorsProps {
  projectId: string;
}

// Generate a random color for each user that's consistent for the same userId
const getUserColor = (userId: string): string => {
  // List of distinct colors good for cursors
  const colors = [
    '#F44336', // Red
    '#2196F3', // Blue
    '#4CAF50', // Green
    '#FF9800', // Orange
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FFEB3B', // Yellow
    '#795548', // Brown
    '#607D8B', // Blue Grey
    '#E91E63' // Pink
  ];

  // Simple hash function to get a consistent index
  const hash = Array.from(userId).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const colorIndex = hash % colors.length;
  return colors[colorIndex];
};

const RemoteCursors: React.FC<RemoteCursorsProps> = ({ projectId }) => {
  const [remoteCursors, setRemoteCursors] = useState<Record<string, User>>({});
  const { socket, isConnected } = useSocket();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!socket || !isConnected || !user) return;

    // Listen for mouse move events from other users
    const handleRemoteMouseMove = (data: {
      userId: string;
      userName: string;
      projectId: string;
      position: { x: number; y: number };
    }) => {
      // Ignore our own cursor
      if (data.userId === user._id) return;

      // Ignore cursors from other projects
      if (data.projectId !== projectId) return;

      setRemoteCursors((prev) => ({
        ...prev,
        [data.userId]: {
          userId: data.userId,
          userName: data.userName,
          position: data.position
        }
      }));
    };

    // Listen for users leaving the project
    const handleUserLeave = (data: { userId: string; projectId: string }) => {
      if (data.projectId !== projectId) return;

      setRemoteCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[data.userId];
        return newCursors;
      });
    };

    socket.on('EDITOR:MOUSE_MOVE', handleRemoteMouseMove);
    socket.on('PROJECT:LEAVE', handleUserLeave);

    // Clean up when unmounting
    return () => {
      socket.off('EDITOR:MOUSE_MOVE', handleRemoteMouseMove);
      socket.off('PROJECT:LEAVE', handleUserLeave);
    };
  }, [socket, isConnected, user, projectId]);

  return (
    <>
      {Object.values(remoteCursors).map((cursorData) => (
        <UserCursor
          key={cursorData.userId}
          userName={cursorData.userName}
          position={cursorData.position}
          color={getUserColor(cursorData.userId)}
        />
      ))}
    </>
  );
};

export default RemoteCursors;
