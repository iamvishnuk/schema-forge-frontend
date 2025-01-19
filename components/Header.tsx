'use client';

import { Database, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { Button } from './ui/button';

type Props = {};

const Header = ({}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <header className='relative z-50 flex h-14 items-center border-b bg-white px-4 lg:px-6'>
        <Link
          className='flex items-center justify-center'
          href='#'
        >
          <Database className='h-6 w-6 text-blue-600' />
          <span className='ml-2 text-2xl font-bold text-gray-900'>
            ERDiagram Pro
          </span>
        </Link>
        <div className='ml-auto flex items-center'>
          <nav className='hidden gap-4 sm:gap-6 md:flex'>
            <Link
              className='text-sm font-medium underline-offset-4 hover:underline'
              href='#features'
            >
              Features
            </Link>
            <Link
              className='text-sm font-medium underline-offset-4 hover:underline'
              href='#pricing'
            >
              Pricing
            </Link>
            <Link
              className='text-sm font-medium underline-offset-4 hover:underline'
              href='#contact'
            >
              Contact
            </Link>
          </nav>
          <Button
            className='ml-4 hidden md:inline-flex'
            variant='outline'
          >
            Sign In
          </Button>
          <Button className='ml-2 hidden md:inline-flex'>Get Started</Button>
          <button
            className='ml-2 md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label='Toggle menu'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      {isMenuOpen && (
        <div className='fixed z-50 md:hidden'>
          <div
            className='fixed bg-gray-800/50'
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className='fixed bottom-0 left-0 top-14 flex w-full flex-col overflow-y-auto bg-white py-4'>
            <Link
              className='w-full py-2 text-center text-sm font-medium hover:bg-gray-100'
              href='#features'
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              className='w-full py-2 text-center text-sm font-medium hover:bg-gray-100'
              href='#pricing'
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              className='w-full py-2 text-center text-sm font-medium hover:bg-gray-100'
              href='#contact'
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Button
              className='mx-4 mt-2'
              variant='outline'
            >
              Sign In
            </Button>
            <Button className='mx-4 mt-2'>Get Started</Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
