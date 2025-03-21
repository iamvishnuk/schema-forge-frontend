import React, { ReactNode } from 'react';

type WorkflowStepProps = {
  icon: ReactNode;
  number: number;
  title: string;
  description: string;
};

const WorkflowStep = ({
  icon,
  number,
  title,
  description
}: WorkflowStepProps) => {
  return (
    <div className='flex flex-col items-center text-center'>
      <div className='relative mb-4'>
        <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10'>
          {icon}
        </div>
        <div className='absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 font-semibold text-white'>
          {number}
        </div>
      </div>
      <h3 className='mb-2 text-xl font-semibold text-gray-700 dark:text-white'>
        {title}
      </h3>
      <p className='text-gray-600 dark:text-gray-400'>{description}</p>
    </div>
  );
};

export default WorkflowStep;
