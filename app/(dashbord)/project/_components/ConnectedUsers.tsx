'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useSocket } from '@/context/socket-provider';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

const ConnectedUsers = ({ className }: Props) => {
  const { socket } = useSocket();

  const [connectedUsers, setConnectedUsers] = useState<
    { userName: string; socketId: string }[]
  >([]);

  useEffect(() => {
    if (socket) {
      socket.on('PROJECT:USER_COUNT', (users) => {
        console.log('users', users);
        toast.success('New User Connected');
        setConnectedUsers(users);
      });

      return () => {
        socket.off('PROJECT:USER_COUNT');
      };
    }
  }, [socket]);

  const visibleUsers = connectedUsers.slice(0, 3);
  const remainingCount = connectedUsers.length - 3;

  return (
    <div className={cn('z-10 flex -space-x-4', className)}>
      {visibleUsers.map((user) => (
        <div
          key={user.socketId}
          className='flex h-8 w-8 items-center justify-center rounded-full border bg-gray-300 shadow-md'
        >
          <span className='text-xs font-semibold text-gray-700 uppercase'>
            {user.userName.charAt(0)}&nbsp;
            {user.userName.charAt(user.userName.length - 1)}
          </span>
        </div>
      ))}
      {remainingCount > 0 && (
        <div className='flex h-8 w-8 items-center justify-center rounded-full border bg-blue-500 shadow-md'>
          <span className='text-xs font-semibold text-white'>
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default ConnectedUsers;
