import { Trash2 } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { parseUserAgent } from '@/lib/parse-user-agent';

interface SessionProps {
  userAgent: string;
  date: Date;
  expireAt: Date;
  isCurrent: boolean;
  onRemove?: () => void;
}

const SessionItem = ({
  userAgent,
  date,
  isCurrent,
  onRemove
}: SessionProps) => {
  const { os, browser, timeAgo, icon: Icon } = parseUserAgent(userAgent, date);

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };
  return (
    <div className='flex w-full items-center'>
      <div className='dorder-[#eee] mr-[16px] flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border dark:border-[rgb(42,45,48)]'>
        <Icon />
      </div>
      <div className='flex flex-1 items-center justify-between'>
        <div className='flex-1'>
          <h5 className='text-sm font-medium'>
            {os} / {browser}
          </h5>
          <div className='flex items-center'>
            {isCurrent ? (
              <div className='flex h-[20px] w-[81px] items-center justify-center rounded-lg bg-green-500/80 px-2 text-xs text-white'>
                Active now
              </div>
            ) : (
              <span className='text-muted-foreground mr-[16px] text-[12px] font-normal'>
                {timeAgo}
              </span>
            )}
          </div>
        </div>

        {!isCurrent && (
          <Button
            variant='ghost'
            size='icon'
            className='hover:cursor-pointer'
            onClick={handleRemove}
          >
            <Trash2 size='29px' />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionItem;
