import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

const registerSchema = z
  .object({
    email: z.string().email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string(),
    givenName: z.string().optional(),
    familyName: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register page — create a new account via Cognito.
 * Pattern from uwu-sri-lanka/website.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      const result = await registerUser({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            ...(data.givenName && { given_name: data.givenName }),
            ...(data.familyName && { family_name: data.familyName }),
          },
        },
      });

      if (!result.isSignUpComplete) {
        // Redirect to confirmation page
        router.push({
          pathname: '/auth/confirm',
          query: { email: data.email },
        });
      } else {
        router.push('/auth/login');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Create Account</title>
      </Head>
      <Container maxWidth='sm' sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h4' component='h1' align='center' gutterBottom>
            Create Account
          </Typography>
          <Typography
            variant='body2'
            align='center'
            color='text.secondary'
            sx={{ mb: 3 }}
          >
            Sign up for a new account
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                {...register('givenName')}
                label='First Name'
                fullWidth
                margin='normal'
                autoComplete='given-name'
                error={!!errors.givenName}
                helperText={errors.givenName?.message}
              />
              <TextField
                {...register('familyName')}
                label='Last Name'
                fullWidth
                margin='normal'
                autoComplete='family-name'
                error={!!errors.familyName}
                helperText={errors.familyName?.message}
              />
            </Box>
            <TextField
              {...register('email')}
              label='Email'
              type='email'
              fullWidth
              margin='normal'
              autoComplete='email'
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('password')}
              label='Password'
              type='password'
              fullWidth
              margin='normal'
              autoComplete='new-password'
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              {...register('confirmPassword')}
              label='Confirm Password'
              type='password'
              fullWidth
              margin='normal'
              autoComplete='new-password'
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              size='large'
              disabled={isSubmitting}
              sx={{ mt: 2, mb: 2 }}
            >
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Link href='/auth/login' passHref legacyBehavior>
              <Typography
                component='a'
                variant='body2'
                color='primary'
                sx={{ cursor: 'pointer' }}
              >
                Already have an account? Sign in
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
