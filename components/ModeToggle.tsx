'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

import { cn } from '@/lib/utils';

const ModeToggle = () => {
  const { setTheme, theme } = useTheme();
  return (
    <div className='flex gap-1 rounded-full border p-1'>
      <button
        className={cn(
          'rounded-full p-1',
          theme === 'light' && 'bg-gray-200 dark:bg-slate-700'
        )}
        onClick={() => setTheme('light')}
      >
        <Sun
          size={18}
          className='text-slate-700 dark:text-slate-200'
        />
      </button>
      <button
        className={cn(
          'rounded-full p-1',
          theme === 'system' && 'bg-gray-200 dark:bg-slate-700'
        )}
        onClick={() => setTheme('system')}
      >
        <Monitor
          size={18}
          className='text-slate-700 dark:text-slate-200'
        />
      </button>
      <button
        className={cn(
          'rounded-full p-1',
          theme === 'dark' && 'bg-gray-200 dark:bg-slate-700'
        )}
        onClick={() => setTheme('dark')}
      >
        <Moon
          size={18}
          className='text-slate-700 dark:text-slate-200'
        />
      </button>
    </div>
  );
};

export default ModeToggle;
