'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import React, { useCallback } from 'react';
import { toast } from 'sonner';

import { revokeMfaMutationFn } from '@/lib/api';

import { Button } from './ui/button';

const RevokeMfaButton = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: revokeMfaMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['authUser']
      });
      toast.success('Success', { description: 'MFA has been revoked' });
    },
    onError: (error) => {
      toast.error('Error', { description: error.message });
    }
  });

  const handleClick = useCallback(() => mutate(), []);

  return (
    <Button
      type='button'
      onClick={handleClick}
      disabled={isPending}
      className='mr-1 h-[35px] bg-red-100 text-red-500 shadow-none hover:cursor-pointer hover:bg-red-500 hover:text-white'
    >
      {isPending && <Loader className='animate-spin' />}
      Revoke Access
    </Button>
  );
};

export default RevokeMfaButton;
