'use client';

import { useMutation } from '@tanstack/react-query';
import { Database, Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ConfirmAccountMutationFn } from '@/lib/api';

export default function ConfirmAccount() {
  const params = useSearchParams();
  const router = useRouter();

  const code = params.get('code');

  const { mutate, isPending } = useMutation({
    mutationFn: ConfirmAccountMutationFn
  });

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (!code) {
      toast.error('Error', {
        description: 'Invalid verification link Please try again later'
      });
    }
    mutate(
      { code: code! },
      {
        onSuccess: () => {
          toast.success('Account confirmed successfully');
          router.push('/login');
        },
        onError: (error) => {
          console.log(error.message);
          toast.error('Error', { description: error.message });
        }
      }
    );
  };

  return (
    <main className='flex h-full min-h-[590px] w-full max-w-full items-center justify-center'>
      <div className='h-full w-full rounded-md p-5'>
        <div className='flex items-center space-x-2'>
          <Database className='h-8 w-8 text-blue-500' />
          <span className='text-2xl font-bold text-white'>SchemaForge</span>
        </div>

        <h1 className='mt-8 mb-4 text-center text-xl font-bold tracking-[-0.16px] text-blue-500 sm:text-left dark:text-[#fcfdffef]'>
          Account confirmation
        </h1>
        <p className='mb-6 text-center text-[15px] font-normal text-white sm:text-left dark:text-[#f1f7feb5]'>
          To confirm your account, please follow the button below.
        </p>
        <Button
          className='h-[40px] w-full bg-blue-500 text-[15px] font-semibold text-white hover:cursor-pointer hover:bg-blue-600'
          disabled={isPending}
          type='submit'
          onClick={handleSubmit}
        >
          {isPending && <Loader className='animate-spin' />}
          Confirm account
        </Button>

        <p className='mt-6 text-sm font-normal text-white dark:text-[#f1f7feb5]'>
          If you have any issue confirming your account please, contact{' '}
          <a
            className='focus-visible:ring-primary text-blue-500 transition duration-150 ease-in-out outline-none hover:underline focus-visible:ring-2'
            href='#'
          >
            support@example.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
