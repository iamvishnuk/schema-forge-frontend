import React from 'react';

import { Button } from './ui/button';

type Props = {};

const Pricing = ({}: Props) => {
  return (
    <section
      id='pricing'
      className='w-full bg-white py-12 md:py-24 lg:py-32'
    >
      <div className='container mx-auto px-4 md:px-6'>
        <h2 className='mb-12 text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
          Simple, Transparent Pricing
        </h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='flex flex-col rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-2xl font-bold'>Basic</h3>
            <p className='mb-4 text-4xl font-bold'>
              $9<span className='text-xl text-gray-500'>/month</span>
            </p>
            <ul className='mb-6 space-y-2'>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                Up to 5 diagrams
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                SQL database support
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                Basic collaboration
              </li>
            </ul>
            <Button className='mt-auto'>Choose Plan</Button>
          </div>
          <div className='flex flex-col rounded-lg bg-blue-600 p-6 text-white shadow-lg'>
            <h3 className='mb-4 text-2xl font-bold'>Pro</h3>
            <p className='mb-4 text-4xl font-bold'>
              $29<span className='text-xl opacity-75'>/month</span>
            </p>
            <ul className='mb-6 space-y-2'>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                Unlimited diagrams
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                SQL & NoSQL support
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                Advanced collaboration
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                Code generation
              </li>
            </ul>
            <Button className='mt-auto bg-white text-blue-600 hover:bg-gray-100'>
              Choose Plan
            </Button>
          </div>
          <div className='flex flex-col rounded-lg bg-white p-6 shadow-lg'>
            <h3 className='mb-4 text-2xl font-bold'>Enterprise</h3>
            <p className='mb-4 text-4xl font-bold'>Custom</p>
            <ul className='mb-6 space-y-2'>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                All Pro features
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                Dedicated support
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                Custom integrations
              </li>
              <li className='flex items-center'>
                <svg
                  className='mr-2 h-4 w-4 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                On-premises deployment
              </li>
            </ul>
            <Button
              variant='outline'
              className='mt-auto'
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
