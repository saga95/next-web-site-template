import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { sendEmail, type EmailParams } from '@/lib/emailjs';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactForm: React.FC = () => {
  const { t } = useTranslation(['forms', 'common']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const emailParams: EmailParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message,
        to_name: 'Support Team', // Customize as needed
      };

      const result = await sendEmail(emailParams);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: t('forms:formSubmitSuccess'),
        });
        reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message,
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: t('forms:formSubmitError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 3,
      }}
      noValidate
      aria-label='Contact form'
    >
      <Typography variant='h4' component='h2' gutterBottom>
        {t('common:contact')}
      </Typography>

      {submitStatus.type && (
        <Alert
          severity={submitStatus.type}
          sx={{ mb: 3 }}
          role='alert'
          aria-live='polite'
        >
          {submitStatus.message}
        </Alert>
      )}

      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('forms:nameLabel')}
            placeholder={t('forms:namePlaceholder')}
            fullWidth
            margin='normal'
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={isSubmitting}
            required
            aria-required='true'
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        )}
      />

      <Controller
        name='email'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('forms:emailLabel')}
            placeholder={t('forms:emailPlaceholder')}
            type='email'
            fullWidth
            margin='normal'
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isSubmitting}
            required
            aria-required='true'
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        )}
      />

      <Controller
        name='message'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={t('forms:messageLabel')}
            placeholder={t('forms:messagePlaceholder')}
            fullWidth
            margin='normal'
            multiline
            rows={4}
            error={!!errors.message}
            helperText={errors.message?.message}
            disabled={isSubmitting}
            required
            aria-required='true'
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
        )}
      />

      <Button
        type='submit'
        variant='contained'
        color='primary'
        fullWidth
        disabled={isSubmitting}
        sx={{ mt: 2 }}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} color='inherit' />
            {t('common:loading')}
          </>
        ) : (
          t('common:submit')
        )}
      </Button>
    </Box>
  );
};