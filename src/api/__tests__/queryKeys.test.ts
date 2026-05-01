import { queryKeys } from '../queryKeys';

describe('queryKeys', () => {
  describe('createQueryKeys', () => {
    it('should return all key for scope', () => {
      expect(queryKeys.todos.all).toEqual(['todos']);
    });

    it('should return lists key', () => {
      expect(queryKeys.todos.lists()).toEqual(['todos', 'list']);
    });

    it('should return list key with filters', () => {
      const key = queryKeys.todos.list({ status: 'active' });
      expect(key).toEqual(['todos', 'list', { status: 'active' }]);
    });

    it('should return list key with empty filters when none provided', () => {
      expect(queryKeys.todos.list()).toEqual(['todos', 'list', {}]);
    });

    it('should return details key', () => {
      expect(queryKeys.todos.details()).toEqual(['todos', 'detail']);
    });

    it('should return detail key for specific id', () => {
      expect(queryKeys.todos.detail('abc-123')).toEqual([
        'todos',
        'detail',
        'abc-123',
      ]);
    });
  });

  describe('scopes', () => {
    it('should have all expected scopes', () => {
      expect(queryKeys).toHaveProperty('todos');
      expect(queryKeys).toHaveProperty('users');
      expect(queryKeys).toHaveProperty('products');
      expect(queryKeys).toHaveProperty('orders');
    });

    it('should use different root keys per scope', () => {
      expect(queryKeys.todos.all).not.toEqual(queryKeys.users.all);
      expect(queryKeys.products.all).not.toEqual(queryKeys.orders.all);
    });
  });
});
