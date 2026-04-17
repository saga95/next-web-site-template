import { ApiClient, ApiError } from '../client';

// Mock aws-amplify/auth
jest.mock('aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn().mockResolvedValue({
    tokens: {
      idToken: { toString: () => 'mock-token-123' },
    },
  }),
}));

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

/**
 * Create a minimal Response-like object that works in jsdom.
 */
function mockResponse(
  body: string | null,
  init: {
    status: number;
    statusText?: string;
    headers?: Record<string, string>;
  }
) {
  return {
    ok: init.status >= 200 && init.status < 300,
    status: init.status,
    statusText: init.statusText ?? '',
    headers: new Headers(init.headers),
    json: async () => (body ? JSON.parse(body) : undefined),
    text: async () => body ?? '',
    clone() {
      return this;
    },
  } as unknown as Response;
}

describe('ApiClient', () => {
  let client: ApiClient;

  beforeEach(() => {
    client = new ApiClient({ baseUrl: 'https://api.example.com' });
    jest.spyOn(global, 'fetch').mockResolvedValue(
      mockResponse(JSON.stringify({ data: 'test' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('HTTP methods', () => {
    it('should make GET requests', async () => {
      const result = await client.get('/items');
      expect(result).toEqual({ data: 'test' });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/items',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should make POST requests with body', async () => {
      await client.post('/items', { name: 'test' });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/items',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        })
      );
    });

    it('should make PUT requests', async () => {
      await client.put('/items/1', { name: 'updated' });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/items/1',
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should make PATCH requests', async () => {
      await client.patch('/items/1', { name: 'patched' });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/items/1',
        expect.objectContaining({ method: 'PATCH' })
      );
    });

    it('should make DELETE requests', async () => {
      await client.delete('/items/1');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/items/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('query params', () => {
    it('should append query params to URL', async () => {
      await client.get('/items', { params: { page: '1', limit: '10' } });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/items?page=1&limit=10',
        expect.anything()
      );
    });
  });

  describe('auth', () => {
    it('should inject auth token by default', async () => {
      await client.get('/items');
      expect(global.fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token-123',
          }),
        })
      );
    });

    it('should skip auth when skipAuth is true', async () => {
      await client.get('/public', { skipAuth: true });
      const { calls } = (global.fetch as jest.Mock).mock;
      const lastCall = calls[calls.length - 1];
      const callHeaders = lastCall[1].headers;
      expect(callHeaders).not.toHaveProperty('Authorization');
    });
  });

  describe('error handling', () => {
    it('should throw ApiError for non-ok responses', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue(
        mockResponse(JSON.stringify({ message: 'Not Found' }), {
          status: 404,
          statusText: 'Not Found',
        })
      );

      await expect(client.get('/missing')).rejects.toThrow(ApiError);
    });

    it('should return status code in ApiError', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue(
        mockResponse('Server Error', {
          status: 500,
          statusText: 'Internal Server Error',
        })
      );

      try {
        await client.get('/error');
        fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect((err as ApiError).status).toBe(500);
      }
    });
  });

  describe('interceptors', () => {
    it('should run request interceptors', async () => {
      const interceptor = jest.fn((url: string, init: RequestInit) => ({
        ...init,
        headers: { ...init.headers, 'X-Custom': 'value' },
      }));

      client.onRequest(interceptor);
      await client.get('/items');
      expect(interceptor).toHaveBeenCalled();
    });

    it('should run response interceptors', async () => {
      const interceptor = jest.fn((response: Response) => response);
      client.onResponse(interceptor);
      await client.get('/items');
      expect(interceptor).toHaveBeenCalled();
    });

    it('should run error interceptors on failure', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockResolvedValue(
          mockResponse('error', { status: 500, statusText: 'Server Error' })
        );

      const errorInterceptor = jest.fn();
      client.onError(errorInterceptor);

      await expect(client.get('/error')).rejects.toThrow();
      expect(errorInterceptor).toHaveBeenCalled();
    });

    it('should allow removing interceptors', async () => {
      const interceptor = jest.fn((response: Response) => response);
      const remove = client.onResponse(interceptor);
      remove();
      await client.get('/items');
      expect(interceptor).not.toHaveBeenCalled();
    });
  });

  describe('204 No Content', () => {
    it('should return undefined for 204 responses', async () => {
      jest
        .spyOn(global, 'fetch')
        .mockResolvedValue(
          mockResponse(null, { status: 204, statusText: 'No Content' })
        );

      const result = await client.delete('/items/1');
      expect(result).toBeUndefined();
    });
  });
});
