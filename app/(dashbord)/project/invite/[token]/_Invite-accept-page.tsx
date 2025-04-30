'use client';
import { useMutation } from '@tanstack/react-query';
import { Database, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { acceptProjectInvitationMutationFn } from '@/lib/api';

type Props = { token: string };

const InviteAcceptPage = ({ token }: Props) => {
  const router = useRouter();
  const [isErrored, setIsErrored] = useState(false);

  const { mutate } = useMutation({
    mutationFn: acceptProjectInvitationMutationFn
  });

  const handleAcceptInvitation = () => {
    setIsErrored(false);

    mutate(token, {
      onSuccess: (res) => {
        const data = res.data;
        if (data.projectId) {
          router.push(`/project/${data.projectId}`);
        }
      },
      onError: (err) => {
        setIsErrored(true);
        console.error('Error accepting invitation:', err.message);
      }
    });
  };

  useEffect(() => {
    handleAcceptInvitation();
  }, []);

  // App logo component to keep UI consistent
  const AppLogo = () => (
    <div className='flex gap-2 text-xl text-blue-600'>
      <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white'>
        <Database className='size-5' />
      </div>
      <span className='text-black dark:text-white'>Schema Forge</span>
    </div>
  );

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex flex-col items-center justify-center rounded-lg border p-8 shadow-sm'>
        <AppLogo />

        {isErrored ? (
          <div className='mt-6 flex flex-col items-center gap-4'>
            <div className='text-center'>
              <h2 className='text-xl font-semibold'>Invitation Error</h2>
              <p className='mt-2 text-red-600'>
                We couldn't process your invitation. It might be expired or
                invalid.
              </p>
            </div>
            <Button
              onClick={handleAcceptInvitation}
              className='mt-2 flex items-center gap-2'
            >
              <RefreshCw className='size-4' />
              Try Again
            </Button>
          </div>
        ) : (
          <div className='mt-6 flex flex-col items-center'>
            <h2 className='text-xl font-semibold'>Accepting Invitation</h2>
            <p className='text-muted-foreground mt-2'>
              Please wait while we process your invitation...
            </p>
            <div className='mt-4 h-[50px] w-[100px]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 300 150'
              >
                <path
                  fill='none'
                  stroke='#155dfc'
                  strokeWidth='15'
                  strokeLinecap='round'
                  strokeDasharray='300 385'
                  strokeDashoffset='0'
                  d='M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z'
                >
                  <animate
                    attributeName='stroke-dashoffset'
                    calcMode='spline'
                    dur='2'
                    values='685;-685'
                    keySplines='0 0 1 1'
                    repeatCount='indefinite'
                  ></animate>
                </path>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteAcceptPage;
