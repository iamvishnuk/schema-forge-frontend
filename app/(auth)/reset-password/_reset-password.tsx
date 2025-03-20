'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Database, Frown, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { ResetPasswordMutationFn } from '@/lib/api';
import { ResetPasswordSchema } from '@/validation';

export default function ResetPassword() {
  const router = useRouter();
  const params = useSearchParams();

  const code = params.get('code');
  const exp = Number(params.get('exp'));
  const now = Date.now();

  const isValid = code && exp && exp > now;

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ResetPasswordMutationFn
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    mutate(
      { password: values.password, code: code! },
      {
        onSuccess: () => {
          toast.success('Success', {
            description: 'Password reset successfully'
          });
          router.push('/login');
        },
        onError: (error) => {
          console.log(error.message);
          toast.error('Error', { description: 'Password reset failed' });
        }
      }
    );
  };

  return (
    <main className='flex h-full min-h-[590px] w-full max-w-full items-center justify-center'>
      {isValid ? (
        <div className='h-full w-full rounded-md p-5'>
          <div className='flex items-center space-x-2'>
            <Database className='h-8 w-8 text-blue-500' />
            <span className='text-2xl font-bold text-white'>SchemaForge</span>
          </div>

          <h1 className='mt-8 mb-1.5 text-center text-xl font-bold tracking-[-0.16px] text-blue-500 sm:text-left dark:text-[#fcfdffef]'>
            Set up a new password
          </h1>
          <p className='mb-6 text-center text-[15px] font-normal text-white sm:text-left dark:text-[#f1f7feb5]'>
            Your password must be different from your previous one.
          </p>
          <Form {...form}>
            <form
              className='flex flex-col gap-6'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className='mb-0'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm text-white dark:text-[#f1f7feb5]'>
                        New password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your password'
                          type='password'
                          className='text-white'
                          autoComplete='new-password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-0'>
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm text-white dark:text-[#f1f7feb5]'>
                        Confirm new password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter your password again'
                          type='password'
                          className='text-white'
                          autoComplete='new-password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className='h-[40px] w-full bg-blue-500 text-[15px] font-semibold text-white hover:cursor-pointer hover:bg-blue-600'
                type='submit'
                disabled={isPending}
              >
                {isPending && <Loader className='animate-spin' />}
                Update password
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className='flex h-[80vh] w-full flex-col items-center justify-center gap-2 rounded-md'>
          <div className='size-[48px]'>
            <Frown
              size='48px'
              className='animate-bounce text-red-500'
            />
          </div>
          <h2 className='text-xl font-bold tracking-[-0.16px] text-blue-500 dark:text-[#fcfdffef]'>
            Invalid or expired reset link
          </h2>
          <p className='mb-2 text-center text-sm font-normal text-white dark:text-[#f1f7feb5]'>
            You can request a new password reset link
          </p>
          <Link href='/forgot-password?email='>
            <Button className='h-[40px] bg-blue-500 text-white hover:cursor-pointer hover:bg-blue-600'>
              <ArrowLeft />
              Go to forgot password
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
