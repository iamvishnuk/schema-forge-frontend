'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, Database, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { LoginMutationFn } from '@/lib/api';
import { LoginSchema } from '@/validation';

export default function Login() {
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { isPending, mutate } = useMutation({
    mutationFn: LoginMutationFn
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    mutate(values, {
      onSuccess: (response) => {
        if (response.data?.mfaRequired) {
          router.push(`/verify-mfa?email=${values.email}`);
        } else {
          toast.success('Logged in successfully');
          router.push('/dashboard');
        }
      },
      onError: (error) => {
        toast.error('Login Error', { description: error.message });
      }
    });
  };

  return (
    <main className='h-auto min-h-[590px] w-full max-w-full pt-10'>
      <div className='h-full w-full rounded-md p-5'>
        <div className='flex items-center space-x-2'>
          <Database className='h-8 w-8 text-blue-500' />
          <span className='text-2xl font-bold dark:text-white'>
            SchemaForge
          </span>
        </div>

        <h1 className='mt-8 mb-1.5 text-center text-xl font-bold tracking-[-0.16px] sm:text-left dark:text-[#fcfdffef]'>
          Log in to Schema Forge
        </h1>
        <p className='mb-8 text-center text-base font-normal sm:text-left dark:text-[#f1f7feb5]'>
          Don't have an account?{' '}
          <Link
            className='text-blue-500 hover:underline'
            href='/signup'
          >
            Sign up
          </Link>
          .
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='mb-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm dark:text-[#f1f7feb5]'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your email'
                        className='focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white'
                        autoComplete='email'
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
                        className='focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-white'
                        autoComplete='current-password'
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='mb-4 flex w-full items-center justify-end'>
              <Link
                className='text-sm hover:underline dark:text-white'
                href='/reset-password?email='
              >
                Forgot your password?
              </Link>
            </div>
            <Button
              className='h-[40px] w-full bg-blue-500 text-[15px] font-semibold text-white hover:cursor-pointer hover:bg-blue-600'
              type='submit'
              disabled={isPending}
            >
              {isPending && <Loader className='animate-spin' />}
              Sign in
              <ArrowRight />
            </Button>

            <div className='mt-6 mb-6 flex items-center justify-center'>
              <div
                aria-hidden='true'
                className='h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]'
                data-orientation='horizontal'
                role='separator'
              ></div>
              <span className='mx-4 text-xs font-normal dark:text-[#f1f7feb5]'>
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
        <p className='dark:text-slate- mt-7 text-xs font-normal dark:text-white'>
          By signing in, you agree to our{' '}
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
    </main>
  );
}
