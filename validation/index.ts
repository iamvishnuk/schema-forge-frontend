import { z } from 'zod';

import {
  InviteTeamRoleEnum,
  ProjectDataBaseTypeEnum
} from '@/definitions/enums';

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

export const CreateTeamSchema = z.object({
  name: z
    .string({ required_error: 'Team name is required' })
    .min(1, { message: 'Team name is required' })
    .max(50, { message: 'Team name should not exceed 50 characters' }),
  description: z.string().optional()
});

export const InviteTeamMemberSchema = z.object({
  inviteeEmail: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Enter a valid email' }),
  role: z.nativeEnum(InviteTeamRoleEnum, {
    required_error: 'Role is required'
  })
});

export const CreateProjectSchema = z
  .object({
    name: z
      .string({ required_error: 'Project name is required' })
      .min(1, { message: 'Project name is required' })
      .max(50, { message: 'Project name should not exceed 50 characters' }),
    description: z.string().optional(),
    teamIds: z.array(z.string()).optional().default([]),
    databaseType: z.nativeEnum(ProjectDataBaseTypeEnum, {
      message: 'Database type is required'
    }),
    tag: z
      .array(z.string())
      .max(5, { message: 'Maximum 5 tags allowed' })
      .optional()
      .default([]),
    connectionString: z.string().optional()
  })
  .refine(
    (data) => {
      // Skip validation if connectionString is not provided
      if (!data.connectionString) return true;

      // Only validate MongoDB connection strings when databaseType is MongoDB
      if (data.databaseType === ProjectDataBaseTypeEnum.MONGODB) {
        try {
          // Basic pattern check
          const regex =
            /^mongodb(\+srv)?:\/\/([^:]+)(:[^@]+)?@([^\/]+)\/([^?]+)(\?.*)?$/;
          if (!regex.test(data.connectionString)) return false;

          const url = new URL(data.connectionString);

          // Protocol check
          if (url.protocol !== 'mongodb:' && url.protocol !== 'mongodb+srv:')
            return false;

          // Username check
          if (!url.username) return false;

          // Database name check
          if (url.pathname.length <= 1) return false;

          return true;
        } catch {
          return false;
        }
      }

      return true;
    },
    {
      message: 'Invalid MongoDB connection string',
      path: ['connectionString'] // This specifies which field the error belongs to
    }
  );

export const SchemaPropertyValidation = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(1, { message: 'Name is required' }),
    type: z
      .string({ required_error: 'Type is required' })
      .min(1, { message: 'Type is required' }),
    required: z.boolean().optional(),
    isPrimary: z.boolean().optional(),
    isUnique: z.boolean().optional(),
    index: z.boolean().optional(),
    ref: z.string().optional(),
    arrayType: z.any().optional()
  })
  .refine(
    (data) => {
      if (data.type !== 'Array') return true;

      if (data.arrayType) return true;

      return false;
    },
    {
      message: 'Array type must be specified when type is Array',
      path: ['arrayType']
    }
  );
