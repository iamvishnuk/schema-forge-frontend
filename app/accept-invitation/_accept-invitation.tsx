'use client';
import { useMutation } from '@tanstack/react-query';
import { Database, Frown, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { acceptTeamInvitationMutationFn } from '@/lib/api';

type Props = {
  token: string | undefined;
  exp: string | undefined;
  email: string | undefined;
  teamId: string | undefined;
  teamName: string | undefined;
};

const AcceptInvitation = ({ token, exp, email, teamId, teamName }: Props) => {
  const router = useRouter();

  const now = Date.now();
  const expiresAt = Number(exp);

  const isValid = token && email && expiresAt && teamId && expiresAt > now;

  const { mutate, isPending } = useMutation({
    mutationFn: acceptTeamInvitationMutationFn
  });

  const handleAcceptInvitation = async () => {
    if (isValid) {
      mutate(
        { token },
        {
          onSuccess: (data) => {
            toast.success('Invitation accepted successfully', {
              description: 'You have been added to the team.'
            });
            router.push(`/team/${data?.data.teamId}`);
          },
          onError: (error) => {
            toast.error('Failed to accept', { description: error.message });
          }
        }
      );
    }
  };

  return (
    <main className='flex h-full min-h-[590px] w-full max-w-full items-center justify-center'>
      {isValid ? (
        <div className='h-full rounded-md p-5'>
          <div className='flex items-center justify-center space-x-2'>
            <Database className='h-8 w-8 text-blue-500' />
            <span className='text-2xl font-bold dark:text-white'>
              SchemaForge
            </span>
          </div>
          <div className='flex flex-col items-center justify-center space-y-6 py-8'>
            <h1 className='text-2xl font-bold dark:text-white'>
              You've been invited to join a team
            </h1>

            <div className='rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800'>
              <h2 className='mb-4 text-xl font-semibold dark:text-white'>
                {teamName}
              </h2>
              <p className='mb-2 text-sm text-gray-600 dark:text-gray-300'>
                You've been invited to join{' '}
                <span className='font-medium'>{teamName}</span> on SchemaForge.
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                Invitation sent to: <span className='font-medium'>{email}</span>
              </p>
              <p className='mt-2 text-sm text-red-500 italic'>
                Note: If you are not expecting this invitation, please ignore
                it.
              </p>
            </div>

            <div className='flex gap-4'>
              <Button
                className='bg-blue-500 text-white hover:bg-blue-600'
                onClick={() => handleAcceptInvitation()}
              >
                {isPending && <Loader className='animate-spin' />}
                Accept Invitation
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className='flex h-[80vh] w-full flex-col items-center justify-center gap-2 rounded-md'>
            <div className='size-[48px]'>
              <Frown
                size='48px'
                className='animate-bounce text-red-500'
              />
            </div>
            <h2 className='text-xl font-bold tracking-[-0.16px] dark:text-[#fcfdffef]'>
              Invalid or expired invitation link
            </h2>
            <p className='mb-2 text-center text-sm font-normal dark:text-[#f1f7feb5]'>
              The team invitation link you're trying to use is no longer valid
            </p>
            <Button
              asChild
              className='h-[40px] bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600'
            >
              <Link
                href='/dashboard'
                className='text-sm text-blue-500 hover:underline'
              >
                Return to home
              </Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AcceptInvitation;
