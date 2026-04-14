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

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login page — email + password sign-in via Cognito.
 * Pattern from uwu-sri-lanka/website.
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.email, data.password);
      const redirect = (router.query['redirect'] as string) || '/';
      router.push(redirect);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Container maxWidth='sm' sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h4' component='h1' align='center' gutterBottom>
            Sign In
          </Typography>
          <Typography
            variant='body2'
            align='center'
            color='text.secondary'
            sx={{ mb: 3 }}
          >
            Enter your credentials to access your account
          </Typography>

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
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
              autoComplete='current-password'
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              size='large'
              disabled={isSubmitting}
              sx={{ mt: 2, mb: 2 }}
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Link href='/auth/forgot-password' passHref legacyBehavior>
              <Typography
                component='a'
                variant='body2'
                color='primary'
                sx={{ cursor: 'pointer' }}
              >
                Forgot password?
              </Typography>
            </Link>
            <Link href='/auth/register' passHref legacyBehavior>
              <Typography
                component='a'
                variant='body2'
                color='primary'
                sx={{ cursor: 'pointer' }}
              >
                Create account
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
