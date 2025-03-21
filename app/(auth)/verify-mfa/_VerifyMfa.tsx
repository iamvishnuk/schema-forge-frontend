'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ArrowRight, Database, Loader } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { verifyMfaAndLoginMutationFn } from '@/lib/api';
import { MfaVerifySchema } from '@/validation';

const VerifyMfa = () => {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get('email');

  const form = useForm<z.infer<typeof MfaVerifySchema>>({
    resolver: zodResolver(MfaVerifySchema),
    defaultValues: {
      pin: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: verifyMfaAndLoginMutationFn
  });

  const onSubmit = async (values: z.infer<typeof MfaVerifySchema>) => {
    if (!email) {
      toast.error('Error', { description: 'Something went wrong, try again' });
      router.push('/login');
      return;
    }
    const data = {
      code: values.pin,
      email: email!
    };
    mutate(data, {
      onSuccess: () => {
        toast.success('Success', {
          description: 'MFA has been verified successfully'
        });
        router.push('/dashboard');
      },
      onError: (error) => {
        toast.error('Error', { description: error.message });
      }
    });
  };

  return (
    <main className='flex h-full min-h-[590px] w-full max-w-full items-center justify-center'>
      <div className='h-full w-full rounded-md p-5'>
        <div className='flex items-center space-x-2'>
          <Database className='h-8 w-8 text-blue-500' />
          <span className='text-2xl font-bold dark:text-white'>
            SchemaForge
          </span>
        </div>

        <h1 className='mt-8 text-center text-xl font-bold tracking-[-0.16px] sm:text-left dark:text-[#fcfdffef]'>
          Multi-Factor Authentication
        </h1>
        <p className='mb-6 text-center text-[15px] font-normal sm:text-left dark:text-[#f1f7feb5]'>
          Enter the code from your authenticator app.
        </p>

        <div className='mt-2'>
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
                    <FormLabel className='mb-1 text-sm font-normal dark:text-white'>
                      One-time code
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
                            className='!h-12 !w-14 !text-lg text-white focus-within:ring-2 focus-within:ring-blue-500'
                          />
                          <InputOTPSlot
                            index={1}
                            className='!h-12 !w-14 !text-lg text-white focus-within:ring-2 focus-within:ring-blue-500'
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={2}
                            className='!h-12 !w-14 !text-lg text-white focus-within:ring-2 focus-within:ring-blue-500'
                          />
                          <InputOTPSlot
                            index={3}
                            className='!h-12 !w-14 !text-lg text-white focus-within:ring-2 focus-within:ring-blue-500'
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={4}
                            className='!h-12 !w-14 !text-lg text-white focus-within:ring-2 focus-within:ring-blue-500'
                          />
                          <InputOTPSlot
                            index={5}
                            className='!h-12 !w-14 !text-lg text-white focus-within:ring-2 focus-within:ring-blue-500'
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className='mt-2 h-[40px] w-full bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600'
                type='submit'
                disabled={isPending}
              >
                {isPending && <Loader className='animate-spin' />}
                Continue
                <ArrowRight />
              </Button>
            </form>
          </Form>
        </div>

        <Button
          onClick={() => router.push('/login')}
          variant='ghost'
          className='mt-2 h-[40px] w-full text-[15px] hover:cursor-pointer hover:bg-blue-100 dark:hover:text-blue-500'
        >
          Return to sign in
        </Button>
      </div>
    </main>
  );
};

export default VerifyMfa;
