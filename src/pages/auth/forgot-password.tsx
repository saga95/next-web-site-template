import { useState } from 'react';
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
import { confirmResetPassword, resetPassword } from 'aws-amplify/auth';

const requestSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

const resetSchema = z.object({
  email: z.string().email('Enter a valid email'),
  code: z.string().min(6, 'Enter the 6-digit code'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special character'),
});

type RequestFormData = z.infer<typeof requestSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

/**
 * Forgot password page — request reset code then set new password.
 * Pattern from uwu-sri-lanka/website.
 */
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Step 1: Request reset code
  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const onRequestSubmit = async (data: RequestFormData) => {
    setError(null);
    try {
      await resetPassword({ username: data.email });
      setEmail(data.email);
      setStep('reset');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to send reset code.'
      );
    }
  };

  // Step 2: Confirm new password
  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email },
  });

  const onResetSubmit = async (data: ResetFormData) => {
    setError(null);
    try {
      await confirmResetPassword({
        username: data.email,
        confirmationCode: data.code,
        newPassword: data.newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to reset password.'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <Container maxWidth='sm' sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant='h4' component='h1' align='center' gutterBottom>
            {step === 'request' ? 'Forgot Password' : 'Reset Password'}
          </Typography>

          {success && (
            <Alert severity='success' sx={{ mb: 2 }}>
              Password reset successfully!{' '}
              <Link href='/auth/login'>Sign in</Link>
            </Alert>
          )}

          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {step === 'request' && !success && (
            <Box
              component='form'
              onSubmit={requestForm.handleSubmit(onRequestSubmit)}
              noValidate
            >
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Enter your email and we&apos;ll send you a verification code to
                reset your password.
              </Typography>
              <TextField
                {...requestForm.register('email')}
                label='Email'
                type='email'
                fullWidth
                margin='normal'
                autoComplete='email'
                error={!!requestForm.formState.errors.email}
                helperText={requestForm.formState.errors.email?.message}
              />
              <Button
                type='submit'
                variant='contained'
                fullWidth
                size='large'
                disabled={requestForm.formState.isSubmitting}
                sx={{ mt: 2, mb: 2 }}
              >
                {requestForm.formState.isSubmitting
                  ? 'Sending…'
                  : 'Send Reset Code'}
              </Button>
            </Box>
          )}

          {step === 'reset' && !success && (
            <Box
              component='form'
              onSubmit={resetForm.handleSubmit(onResetSubmit)}
              noValidate
            >
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                Enter the code sent to <strong>{email}</strong> and your new
                password.
              </Typography>
              <TextField
                {...resetForm.register('email')}
                label='Email'
                type='email'
                fullWidth
                margin='normal'
                disabled
              />
              <TextField
                {...resetForm.register('code')}
                label='Verification Code'
                fullWidth
                margin='normal'
                autoComplete='one-time-code'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                error={!!resetForm.formState.errors.code}
                helperText={resetForm.formState.errors.code?.message}
              />
              <TextField
                {...resetForm.register('newPassword')}
                label='New Password'
                type='password'
                fullWidth
                margin='normal'
                autoComplete='new-password'
                error={!!resetForm.formState.errors.newPassword}
                helperText={resetForm.formState.errors.newPassword?.message}
              />
              <Button
                type='submit'
                variant='contained'
                fullWidth
                size='large'
                disabled={resetForm.formState.isSubmitting}
                sx={{ mt: 2, mb: 2 }}
              >
                {resetForm.formState.isSubmitting
                  ? 'Resetting…'
                  : 'Reset Password'}
              </Button>
            </Box>
          )}

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
