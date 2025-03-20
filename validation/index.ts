import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, { message: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email({ message: 'Please enter a valid email' })
      .min(1, { message: 'Email is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .trim()
      .min(1, { message: 'Password is required' }),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .trim()
      .min(1, { message: 'Confirm password is required' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Please enter a valid email' })
    .min(1, { message: 'Email is required' }),
  password: z
    .string({ required_error: 'Password is required' })
    .trim()
    .min(1, { message: 'Password is required' })
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Please enter a valid email' })
    .min(1, { message: 'Email is required' })
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .trim()
      .min(1, { message: 'Password is required' }),
    confirmPassword: z
      .string({ required_error: 'Confirm password is required' })
      .trim()
      .min(1, { message: 'Confirm password is required' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword']
  });

export const MfaVerifySchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.'
  })
});
