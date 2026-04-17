/**
 * Centralized file upload validation.
 *
 * Provides MIME type allow-listing and max file size enforcement
 * for all upload flows (product images, user avatars, documents, etc.).
 */

export const UPLOAD_PRESETS = {
  image: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
      'image/svg+xml',
    ],
    label: 'Image',
  },
  document: {
    maxSizeBytes: 50 * 1024 * 1024, // 50 MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'text/plain',
    ],
    label: 'Document',
  },
  avatar: {
    maxSizeBytes: 5 * 1024 * 1024, // 5 MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    label: 'Avatar',
  },
  any: {
    maxSizeBytes: 200 * 1024 * 1024, // 200 MB
    allowedMimeTypes: [] as string[], // empty = allow all
    label: 'File',
  },
} as const;

export type UploadPreset = keyof typeof UPLOAD_PRESETS;

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate a file against an upload preset.
 */
export function validateUpload(
  file: File,
  preset: UploadPreset = 'any'
): UploadValidationResult {
  const config = UPLOAD_PRESETS[preset];

  if (file.size > config.maxSizeBytes) {
    const maxMB = Math.round(config.maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `${config.label} must be smaller than ${maxMB} MB.`,
    };
  }

  if (config.allowedMimeTypes.length > 0) {
    const allowed = config.allowedMimeTypes as readonly string[];
    if (!allowed.includes(file.type)) {
      return {
        valid: false,
        error: `${config.label} type "${file.type || 'unknown'}" is not allowed. Accepted: ${allowed.join(', ')}.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate multiple files against an upload preset.
 */
export function validateUploads(
  files: File[],
  preset: UploadPreset = 'any'
): UploadValidationResult {
  for (const file of files) {
    const result = validateUpload(file, preset);
    if (!result.valid) return result;
  }
  return { valid: true };
}

/**
 * Generate an HTML accept string for file inputs.
 */
export function getAcceptString(preset: UploadPreset): string {
  const config = UPLOAD_PRESETS[preset];
  return config.allowedMimeTypes.length > 0
    ? (config.allowedMimeTypes as readonly string[]).join(',')
    : '*/*';
}
