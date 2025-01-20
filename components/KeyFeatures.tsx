import { Database, Share2, Zap } from 'lucide-react';
import React from 'react';

type Props = {};

const KeyFeatures = ({}: Props) => {
  return (
    <section
      id='features'
      className='w-full bg-white py-12 md:py-24 lg:py-32'
    >
      <div className='container mx-auto px-4 md:px-6'>
        <h2 className='mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
          Key Features
        </h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='flex flex-col items-center text-center'>
            <Database className='mb-4 h-12 w-12 text-blue-600' />
            <h3 className='mb-2 text-xl font-bold'>SQL & NoSQL Support</h3>
            <p className='text-gray-500'>
              Design schemas for both relational and non-relational databases
              with ease.
            </p>
          </div>
          <div className='flex flex-col items-center text-center'>
            <Share2 className='mb-4 h-12 w-12 text-blue-600' />
            <h3 className='mb-2 text-xl font-bold'>Real-time Collaboration</h3>
            <p className='text-gray-500'>
              Work together with your team in real-time, no matter where you
              are.
            </p>
          </div>
          <div className='flex flex-col items-center text-center'>
            <Zap className='mb-4 h-12 w-12 text-blue-600' />
            <h3 className='mb-2 text-xl font-bold'>Instant Code Generation</h3>
            <p className='text-gray-500'>
              Generate database scripts and schemas with a single click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
