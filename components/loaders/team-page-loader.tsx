import React from 'react';

import { Skeleton } from '../ui/skeleton';

const TeamPageLoader = () => {
  return (
    <div>
      <Skeleton className='h-20 w-full animate-pulse' />
      <div className='mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {[...Array(3)].map((_, index) => (
          <Skeleton
            key={index}
            className='h-[150px] animate-pulse'
          />
        ))}
      </div>
    </div>
  );
};

export default TeamPageLoader;
