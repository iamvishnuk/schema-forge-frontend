import React, { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className='rounded-xl border border-gray-700 bg-slate-800/50 p-6'>
      <div className='mb-4'>{icon}</div>
      <h3 className='mb-2 text-xl font-semibold text-white'>{title}</h3>
      <p className='text-gray-400'>{description}</p>
    </div>
  );
};

export default FeatureCard;
