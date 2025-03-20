'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Check, Copy, Loader } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from '@/components/ui/input-otp';
import { useAuthContext } from '@/context/auth-provider';
import { setUpMfaMutationFn, verifyMafMutationFn } from '@/lib/api';
import { MfaVerifySchema } from '@/validation';

import RevokeMfaButton from './RevokeMfaButton';
import { Skeleton } from './ui/skeleton';

const EnableMfa = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['mfa-setup'],
    queryFn: setUpMfaMutationFn,
    enabled: isOpen,
    staleTime: Infinity
  });
  const mfaData = data?.data;

  const { mutate, isPending } = useMutation({
    mutationFn: verifyMafMutationFn
  });

  const form = useForm<z.infer<typeof MfaVerifySchema>>({
    resolver: zodResolver(MfaVerifySchema),
    defaultValues: {
      pin: ''
    }
  });

  function onSubmit(values: z.infer<typeof MfaVerifySchema>) {
    const data = {
      code: values.pin,
      secretKey: mfaData?.secret!
    };
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['authUser']
        });
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error('Error', { description: error.message });
      }
    });
  }

  const onCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  }, []);

  return (
    <div className='via-root to-root rounded-xl bg-gradient-to-r p-0.5'>
      <div className='rounded-[10px] p-6'>
        <div className='flex items-center gap-3'>
          <h3 className='text-slate-12 mb-1 text-xl font-bold tracking-[-0.16px]'>
            Multi-Factor Authentication (MFA)
          </h3>
          {user?.userPreferences?.enable2FA && (
            <span className='flex h-6 flex-row items-center justify-center gap-1 rounded bg-green-100 px-2 text-xs font-medium whitespace-nowrap text-green-500 select-none'>
              Enabled
            </span>
          )}
        </div>
        <p className='mb-6 text-sm font-normal text-[#0007149f] dark:text-gray-100'>
          Protect your account by adding an extra layer of security.
        </p>
        {user?.userPreferences?.enable2FA ? (
          <RevokeMfaButton />
        ) : (
          <Dialog
            modal
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <DialogTrigger asChild>
              <Button
                disabled={isLoading}
                className='h-[35px] bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600'
              >
                Enable MFA
              </Button>
            </DialogTrigger>
            <DialogContent className='!gap-0'>
              <DialogHeader>
                <DialogTitle className='text-slate-12 text-[17px] font-semibold'>
                  Setup Multi-Factor Authentication
                </DialogTitle>
              </DialogHeader>
              <div className=''>
                <p className='mt-6 text-sm font-bold text-[#0007149f] dark:text-inherit'>
                  Scan the QR code
                </p>
                <span className='text-sm font-normal text-[#0007149f] dark:text-inherit'>
                  Use an app like{' '}
                  <a
                    className='!text-primary decoration-primary hover:decoration-blue-11 dark:decoration-slate-9 underline decoration-1 underline-offset-2 transition duration-200 ease-in-out dark:text-current dark:hover:decoration-current'
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://support.1password.com/one-time-passwords/'
                  >
                    1Password
                  </a>{' '}
                  or{' '}
                  <a
                    className='!text-primary decoration-primary hover:decoration-blue-11 dark:decoration-slate-9 underline decoration-1 underline-offset-2 transition duration-200 ease-in-out dark:text-current dark:hover:decoration-current'
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://safety.google/authentication/'
                  >
                    Google Authenticator
                  </a>{' '}
                  to scan the QR code below.
                </span>
              </div>
              <div className='mt-4 flex flex-row items-center gap-4'>
                <div className='rounded-md border border-[#0009321f] bg-white p-2 dark:border-gray-600'>
                  {isLoading || !mfaData?.qrImageUrl ? (
                    <Skeleton className='h-[160px] w-[160px]' />
                  ) : (
                    <img
                      alt='QR code'
                      decoding='async'
                      width='160'
                      height='160'
                      src={mfaData.qrImageUrl}
                      className='rounded-md'
                    />
                  )}
                </div>

                {showKey ? (
                  <div className='w-full'>
                    <div className='dark:text-muted-foreground flex items-center gap-1 text-sm font-normal text-[#0007149f]'>
                      <span>Copy setup key</span>
                      <button
                        onClick={() => onCopy(mfaData?.secret!)}
                        type='button'
                        className='hover:cursor-copy'
                        disabled={copied}
                      >
                        {copied ? <Check size='20px' /> : <Copy size='20px' />}
                      </button>
                    </div>
                    <p className='dark:text-muted-foreground line-clamp-1 block w-[200px] truncate text-sm text-black'>
                      {mfaData?.secret}
                    </p>
                  </div>
                ) : (
                  <span className='dark:text-muted-foreground text-sm font-normal text-[#0007149f]'>
                    Can't scan the code?
                    <button
                      className='text-primary block transition duration-200 ease-in-out hover:underline dark:text-white'
                      type='button'
                      onClick={() => setShowKey(true)}
                    >
                      View the Setup Key
                    </button>
                  </span>
                )}
              </div>

              <div className='mt-8 border-t'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='mt-6 flex w-full flex-col gap-4'
                  >
                    <FormField
                      control={form.control}
                      name='pin'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-slate-11 mb-1 text-sm font-bold'>
                            Then enter the code
                          </FormLabel>
                          <FormControl>
                            <InputOTP
                              className='flex items-center !text-lg'
                              maxLength={6}
                              pattern={REGEXP_ONLY_DIGITS}
                              {...field}
                              style={{ justifyContent: 'center' }}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot
                                  index={0}
                                  className='!h-12 !w-14 !text-lg'
                                />
                                <InputOTPSlot
                                  index={1}
                                  className='!h-12 !w-14 !text-lg'
                                />
                              </InputOTPGroup>
                              <InputOTPGroup>
                                <InputOTPSlot
                                  index={2}
                                  className='!h-12 !w-14 !text-lg'
                                />
                                <InputOTPSlot
                                  index={3}
                                  className='!h-12 !w-14 !text-lg'
                                />
                              </InputOTPGroup>
                              <InputOTPGroup>
                                <InputOTPSlot
                                  index={4}
                                  className='!h-12 !w-14 !text-lg'
                                />
                                <InputOTPSlot
                                  index={5}
                                  className='!h-12 !w-14 !text-lg'
                                />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type='submit'
                      className='h-[40px] w-full bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600'
                      disabled={isPending}
                    >
                      {isPending && <Loader className='animate-spin' />}
                      Verify
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default EnableMfa;
