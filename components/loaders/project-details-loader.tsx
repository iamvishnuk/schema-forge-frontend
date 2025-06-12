import React from 'react';

import { Skeleton } from '../ui/skeleton';

const ProjectDetailsLoader = () => {
  return (
    <div className='h-screen w-full space-y-5'>
      <Skeleton className='h-5 w-full animate-pulse' />
      <Skeleton className='h-full w-full animate-pulse' />
    </div>
  );
};

export default ProjectDetailsLoader;
