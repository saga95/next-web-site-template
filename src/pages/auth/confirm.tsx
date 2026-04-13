import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

const confirmSchema = z.object({
  email: z.string().email('Enter a valid email'),
  code: z.string().min(6, 'Enter the 6-digit code'),
});

type ConfirmFormData = z.infer<typeof confirmSchema>;

/**
 * Confirm registration page — verify email with code.
 * Pattern from uwu-sri-lanka/website.
 */
export default function ConfirmPage() {
  const router = useRouter();
  const { confirmRegistration } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmSchema),
    defaultValues: {
      email: (router.query['email'] as string) || '',
    },
  });

  const onSubmit = async (data: ConfirmFormData) => {
    setError(null);
    try {
      await confirmRegistration({
        username: data.email,
        confirmationCode: data.code,
      });
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Confirmation failed. Please try again.'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Confirm Account</title>
      </Head>
      <Container maxWidth='sm' sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h4' component='h1' align='center' gutterBottom>
            Confirm Your Email
          </Typography>
          <Typography
            variant='body2'
            align='center'
            color='text.secondary'
            sx={{ mb: 3 }}
          >
            Enter the verification code sent to your email
          </Typography>

          {success && (
            <Alert severity='success' sx={{ mb: 2 }}>
              Account confirmed! Redirecting to login…
            </Alert>
          )}

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
              {...register('code')}
              label='Verification Code'
              fullWidth
              margin='normal'
              autoComplete='one-time-code'
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              error={!!errors.code}
              helperText={errors.code?.message}
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              size='large'
              disabled={isSubmitting || success}
              sx={{ mt: 2, mb: 2 }}
            >
              {isSubmitting ? 'Verifying…' : 'Verify'}
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
                Back to sign in
              </Typography>
            </Link>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
