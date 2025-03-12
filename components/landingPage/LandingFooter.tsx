import { Database } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const LandingFooter = () => {
  return (
    <footer className='border-t border-gray-800'>
      <div className='container mx-auto px-6 py-12'>
        <div className='mb-8 grid gap-8 md:grid-cols-4'>
          <div>
            <div className='mb-4 flex items-center space-x-2'>
              <Database className='h-6 w-6 text-blue-500' />
              <span className='text-xl font-bold text-white'>SchemaForge</span>
            </div>
            <p className='text-gray-400'>
              Building better MongoDB schemas for modern applications.
            </p>
          </div>
          <div>
            <h3 className='mb-4 font-semibold text-white'>Product</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#features'
                  className='text-gray-400 transition hover:text-white'
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='#pricing'
                  className='text-gray-400 transition hover:text-white'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  API
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 font-semibold text-white'>Company</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 font-semibold text-white'>Legal</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href='#'
                  className='text-gray-400 transition hover:text-white'
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className='border-t border-gray-800 pt-8'>
          <p className='text-gray-400'>
            © 2025 SchemaForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
