import React, { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className='rounded-xl border bg-blue-50 p-6 shadow-lg dark:border-gray-700 dark:bg-slate-800/50'>
      <div className='mb-4'>{icon}</div>
      <h3 className='mb-2 text-xl font-semibold dark:text-white'>{title}</h3>
      <p className='text-gray-600 dark:text-gray-400'>{description}</p>
    </div>
  );
};

export default FeatureCard;
