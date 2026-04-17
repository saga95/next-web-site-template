import {
  UPLOAD_PRESETS,
  getAcceptString,
  validateUpload,
  validateUploads,
} from '../uploadConfig';

function createMockFile(name: string, sizeBytes: number, type: string): File {
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type });
}

describe('uploadConfig', () => {
  describe('validateUpload', () => {
    it('should accept a valid image file', () => {
      const file = createMockFile('photo.jpg', 1024 * 1024, 'image/jpeg');
      expect(validateUpload(file, 'image')).toEqual({ valid: true });
    });

    it('should reject an image that exceeds max size', () => {
      const file = createMockFile('huge.jpg', 11 * 1024 * 1024, 'image/jpeg');
      const result = validateUpload(file, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('10 MB');
    });

    it('should reject a file with disallowed MIME type', () => {
      const file = createMockFile('hack.exe', 1024, 'application/x-msdownload');
      const result = validateUpload(file, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should accept any type for the "any" preset', () => {
      const file = createMockFile('data.bin', 1024, 'application/octet-stream');
      expect(validateUpload(file, 'any')).toEqual({ valid: true });
    });

    it('should reject oversized file for "any" preset', () => {
      const file = createMockFile(
        'huge.bin',
        201 * 1024 * 1024,
        'application/octet-stream'
      );
      const result = validateUpload(file, 'any');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('200 MB');
    });

    it('should accept valid avatar', () => {
      const file = createMockFile('avatar.png', 2 * 1024 * 1024, 'image/png');
      expect(validateUpload(file, 'avatar')).toEqual({ valid: true });
    });

    it('should reject avatar over 5MB', () => {
      const file = createMockFile('avatar.png', 6 * 1024 * 1024, 'image/png');
      const result = validateUpload(file, 'avatar');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('5 MB');
    });

    it('should accept valid document', () => {
      const file = createMockFile('report.pdf', 1024 * 1024, 'application/pdf');
      expect(validateUpload(file, 'document')).toEqual({ valid: true });
    });

    it('should default to "any" preset when no preset is given', () => {
      const file = createMockFile('file.txt', 1024, 'text/plain');
      expect(validateUpload(file)).toEqual({ valid: true });
    });
  });

  describe('validateUploads', () => {
    it('should accept multiple valid files', () => {
      const files = [
        createMockFile('a.jpg', 1024, 'image/jpeg'),
        createMockFile('b.png', 1024, 'image/png'),
      ];
      expect(validateUploads(files, 'image')).toEqual({ valid: true });
    });

    it('should fail on first invalid file', () => {
      const files = [
        createMockFile('a.jpg', 1024, 'image/jpeg'),
        createMockFile('b.exe', 1024, 'application/x-msdownload'),
      ];
      const result = validateUploads(files, 'image');
      expect(result.valid).toBe(false);
    });

    it('should return valid for empty array', () => {
      expect(validateUploads([], 'image')).toEqual({ valid: true });
    });
  });

  describe('getAcceptString', () => {
    it('should return comma-separated MIME types for image preset', () => {
      const accept = getAcceptString('image');
      expect(accept).toContain('image/jpeg');
      expect(accept).toContain('image/png');
    });

    it('should return */* for "any" preset', () => {
      expect(getAcceptString('any')).toBe('*/*');
    });
  });

  describe('UPLOAD_PRESETS', () => {
    it('should have expected preset keys', () => {
      expect(Object.keys(UPLOAD_PRESETS)).toEqual(
        expect.arrayContaining(['image', 'document', 'avatar', 'any'])
      );
    });
  });
});
