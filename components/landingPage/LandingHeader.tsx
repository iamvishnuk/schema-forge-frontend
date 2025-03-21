import { Database } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const LandingHeader = () => {
  return (
    <header className='container mx-auto px-6 py-16'>
      <nav className='mb-16 flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <Database className='h-8 w-8 text-blue-500' />
          <span className='text-2xl font-bold text-black/70 dark:text-white'>
            SchemaForge
          </span>
        </div>
        <div className='flex items-center space-x-8'>
          <Link
            href='#features'
            className='hidden text-gray-600 transition hover:text-black md:block dark:text-gray-300 dark:hover:text-white'
          >
            Features
          </Link>
          <Link
            href='#how-it-works'
            className='hidden text-gray-600 transition hover:text-black md:block dark:text-gray-300 dark:hover:text-white'
          >
            How It Works
          </Link>
          <Link
            href='#pricing'
            className='hidden text-gray-600 transition hover:text-black md:block dark:text-gray-300 dark:hover:text-white'
          >
            Pricing
          </Link>
          <Link
            href='/login'
            className='rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-6 py-2 text-white transition hover:cursor-pointer'
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className='flex flex-col items-center text-center'>
        <h1 className='mb-6 text-5xl font-bold md:text-6xl dark:text-white'>
          Design MongoDB Schemas
          <br />
          <span className='text-blue-500'>With Confidence</span>
        </h1>
        <p className='mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300'>
          Create, visualize, and optimize your MongoDB schemas with our powerful
          visual schema builder. Perfect for developers and teams who want to
          build better databases faster.
        </p>
        <div className='flex gap-4'>
          <button className='rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 px-8 py-3 text-lg font-semibold text-nowrap text-white transition hover:cursor-pointer'>
            Start Free Trial
          </button>
          {/* <button className='rounded-lg border border-gray-500 px-8 py-3 text-lg font-semibold text-white transition hover:border-gray-400'>
            Watch Demo
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
