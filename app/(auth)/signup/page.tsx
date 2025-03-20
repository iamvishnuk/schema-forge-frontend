'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, Database, Loader, MailCheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { registerMutationFn } from '@/lib/api';
import { RegisterSchema } from '@/validation';

export default function SignUp() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    mutate(values, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error) => {
        console.log(error);
        toast.error('Error', { description: error.message });
      }
    });
  };

  return (
    <>
      <main className='h-auto min-h-[590px] w-full max-w-full pt-10'>
        {!isSubmitted ? (
          <div className='w-full rounded-md p-5'>
            <div className='flex items-center space-x-2'>
              <Database className='h-8 w-8 text-blue-500' />
              <span className='text-2xl font-bold text-white'>SchemaForge</span>
            </div>

            <h1 className='mt-8 mb-1.5 text-center text-xl font-bold tracking-[-0.16px] text-blue-500 sm:text-left dark:text-[#fcfdffef]'>
              Create a Schema Forge account
            </h1>
            <p className='mb-6 text-center text-base font-normal text-white sm:text-left dark:text-[#f1f7feb5]'>
              Already have an account?{' '}
              <Link
                className='text-blue-500'
                href='/'
              >
                Sign in
              </Link>
              .
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='mb-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm text-white dark:text-[#f1f7feb5]'>
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter your name'
                            autoComplete='name'
                            className='text-white'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-4'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm text-white dark:text-[#f1f7feb5]'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Enter you email'
                            autoComplete='email'
                            className='text-white'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-4'>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm text-white dark:text-[#f1f7feb5]'>
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='••••••••••••'
                            type='password'
                            autoComplete='new-password'
                            className='text-white'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-4'>
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm text-white dark:text-[#f1f7feb5]'>
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='••••••••••••'
                            type='password'
                            autoComplete='new-password'
                            className='text-white'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  className='h-[40px] w-full !bg-blue-500 text-[15px] font-semibold text-white hover:!cursor-pointer hover:!bg-blue-600'
                  type='submit'
                  disabled={isPending}
                >
                  {isPending && <Loader className='animate-spin' />}
                  Create account
                  <ArrowRight />
                </Button>

                <div className='mt-4 mb-4 flex items-center justify-center'>
                  <div
                    aria-hidden='true'
                    className='h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]'
                    data-orientation='horizontal'
                    role='separator'
                  ></div>
                  <span className='mx-4 text-xs font-normal text-white dark:text-[#f1f7feb5]'>
                    OR
                  </span>
                  <div
                    aria-hidden='true'
                    className='h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]'
                    data-orientation='horizontal'
                    role='separator'
                  ></div>
                </div>
              </form>
            </Form>
            <Button
              variant='outline'
              className='h-[40px] w-full'
            >
              Email magic link
            </Button>
            <p className='mt-4 text-xs font-normal text-white'>
              By signing up, you agree to our{' '}
              <Link
                className='text-blue-500 hover:underline'
                href='#'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                className='text-blue-500 hover:underline'
                href='#'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className='flex h-[80vh] w-full flex-col items-center justify-center gap-2 rounded-md'>
            <div className='size-[48px]'>
              <MailCheckIcon
                size='48px'
                className='animate-bounce text-blue-600'
              />
            </div>
            <h2 className='text-xl font-bold tracking-[-0.16px] text-white dark:text-[#fcfdffef]'>
              Check your email
            </h2>
            <p className='mb-2 text-center text-sm font-normal text-white dark:text-[#f1f7feb5]'>
              We just sent a verification link to {form.getValues('email')}.
            </p>
            <Link href='/login'>
              <Button className='h-[40px] bg-blue-500 hover:cursor-pointer hover:bg-blue-600'>
                Go to login
                <ArrowRight />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
