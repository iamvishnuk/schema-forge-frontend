import React from 'react';

import { Skeleton } from '../ui/skeleton';

const TeamDetailsPageLoader = () => {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-20 w-full animate-pulse' />
      <Skeleton className='h-8 w-full animate-pulse' />
      <Skeleton className='h-48 w-full animate-pulse' />
      <Skeleton className='h-8 w-full animate-pulse' />
    </div>
  );
};

export default TeamDetailsPageLoader;
