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
import { ForgotPasswordSendEmailMutationFn } from '@/lib/api';
import { ForgotPasswordSchema } from '@/validation';

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ForgotPasswordSendEmailMutationFn
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    mutate(values, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error) => {
        toast.error('Error', { description: error.message });
      }
    });
  };

  return (
    <main className='flex h-full min-h-[590px] w-full max-w-full items-center justify-center'>
      {!isSubmitted ? (
        <div className='h-full w-full rounded-md p-5'>
          <div className='flex items-center space-x-2'>
            <Database className='h-8 w-8 text-blue-500' />
            <span className='text-2xl font-bold text-white'>SchemaForge</span>
          </div>

          <h1 className='mt-8 mb-1.5 text-center text-xl font-bold tracking-[-0.16px] text-blue-500 sm:text-left dark:text-[#fcfdffef]'>
            Reset password
          </h1>
          <p className='mb-6 text-center text-base font-normal text-white sm:text-left dark:text-[#f1f7feb5]'>
            Include the email address associated with your account and we’ll
            send you an email with instructions to reset your password.
          </p>
          <Form {...form}>
            <form
              className='flex flex-col gap-6'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className='mb-0'>
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
                          placeholder='Enter your email'
                          className='text-white'
                          autoComplete='email'
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
                Send reset instructions
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className='flex h-[80vh] w-full flex-col items-center justify-center gap-2 rounded-md'>
          <div className='size-[48px]'>
            <MailCheckIcon
              size='48px'
              className='animate-bounce text-blue-500'
            />
          </div>
          <h2 className='text-xl font-bold tracking-[-0.16px] text-white dark:text-[#fcfdffef]'>
            Check your email
          </h2>
          <p className='mb-2 text-center text-sm font-normal text-white dark:text-[#f1f7feb5]'>
            We just sent a password reset link to {form.getValues('email')}.
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
  );
}
