import {
  invalidateDetail,
  invalidateList,
  invalidateScope,
} from '../queryInvalidation';
import { queryKeys } from '../queryKeys';

describe('queryInvalidation', () => {
  const mockInvalidateQueries = jest.fn().mockResolvedValue(undefined);
  const mockClient = {
    invalidateQueries: mockInvalidateQueries,
  } as unknown as import('@tanstack/react-query').QueryClient;

  beforeEach(() => {
    mockInvalidateQueries.mockClear();
  });

  describe('invalidateScope', () => {
    it('should invalidate all queries for a scope', async () => {
      await invalidateScope(mockClient, 'todos');
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: queryKeys.todos.all,
      });
    });
  });

  describe('invalidateList', () => {
    it('should invalidate all list queries for a scope', async () => {
      await invalidateList(mockClient, 'todos');
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: queryKeys.todos.lists(),
      });
    });
  });

  describe('invalidateDetail', () => {
    it('should invalidate a specific detail query', async () => {
      await invalidateDetail(mockClient, 'todos', 'abc-123');
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: queryKeys.todos.detail('abc-123'),
      });
    });
  });
});
