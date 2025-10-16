import emailjs from '@emailjs/browser';

/**
 * EmailJS Configuration
 * 
 * To use EmailJS:
 * 1. Sign up at https://www.emailjs.com/
 * 2. Create an email service and template
 * 3. Add your credentials to environment variables:
 *    - NEXT_PUBLIC_EMAILJS_SERVICE_ID
 *    - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
 *    - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
 */

// Initialize EmailJS with your public key
export const initEmailJS = () => {
  const publicKey = process.env['NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'];
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

// Send email using EmailJS
export interface EmailParams {
  from_name: string;
  from_email: string;
  to_name?: string;
  message: string;
  [key: string]: string | undefined;
}

export const sendEmail = async (
  templateParams: EmailParams
): Promise<{ success: boolean; message: string }> => {
  try {
    const serviceId = process.env['NEXT_PUBLIC_EMAILJS_SERVICE_ID'];
    const templateId = process.env['NEXT_PUBLIC_EMAILJS_TEMPLATE_ID'];
    const publicKey = process.env['NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'];

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS configuration is missing. Please check your environment variables.');
    }

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams as Record<string, unknown>,
      publicKey
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Email sent successfully!',
      };
    }

    throw new Error('Failed to send email');
  } catch (error) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email. Please try again.',
    };
  }
};

// Send email using a form element
export const sendEmailFromForm = async (
  form: HTMLFormElement
): Promise<{ success: boolean; message: string }> => {
  try {
    const serviceId = process.env['NEXT_PUBLIC_EMAILJS_SERVICE_ID'];
    const templateId = process.env['NEXT_PUBLIC_EMAILJS_TEMPLATE_ID'];
    const publicKey = process.env['NEXT_PUBLIC_EMAILJS_PUBLIC_KEY'];

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS configuration is missing. Please check your environment variables.');
    }

    const response = await emailjs.sendForm(
      serviceId,
      templateId,
      form,
      publicKey
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Email sent successfully!',
      };
    }

    throw new Error('Failed to send email');
  } catch (error) {
    console.error('EmailJS Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email. Please try again.',
    };
  }
};