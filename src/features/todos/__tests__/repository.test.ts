import {
  createTodo,
  deleteTodo,
  getTodo,
  listTodos,
  updateTodo,
} from '../repository';

// crypto.randomUUID mock
beforeAll(() => {
  let counter = 0;
  jest
    .spyOn(globalThis.crypto, 'randomUUID')
    .mockImplementation(
      () =>
        `mock-uuid-${++counter}` as `${string}-${string}-${string}-${string}-${string}`
    );
});

// Reset mock store between tests by creating fresh data
beforeEach(async () => {
  // Clear by listing and deleting all
  const existing = await listTodos();
  for (const todo of existing) {
    await deleteTodo(todo.id);
  }
});

describe('todo repository', () => {
  it('starts with an empty list', async () => {
    const todos = await listTodos();
    expect(todos).toEqual([]);
  });

  it('creates a todo with correct shape', async () => {
    const todo = await createTodo({ title: 'Write tests' });

    expect(todo).toMatchObject({
      title: 'Write tests',
      completed: false,
    });
    expect(todo.id).toBeDefined();
    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
  });

  it('lists created todos', async () => {
    await createTodo({ title: 'First' });
    await createTodo({ title: 'Second' });

    const todos = await listTodos();
    expect(todos).toHaveLength(2);
    expect(todos.map(t => t.title)).toEqual(['First', 'Second']);
  });

  it('gets a todo by id', async () => {
    const created = await createTodo({ title: 'Find me' });
    const found = await getTodo(created.id);

    expect(found).toMatchObject({ title: 'Find me', id: created.id });
  });

  it('returns null for non-existent id', async () => {
    const found = await getTodo('does-not-exist');
    expect(found).toBeNull();
  });

  it('updates a todo', async () => {
    const created = await createTodo({ title: 'Original' });
    const updated = await updateTodo({
      id: created.id,
      title: 'Updated',
      completed: true,
    });

    expect(updated.title).toBe('Updated');
    expect(updated.completed).toBe(true);
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(created.updatedAt).getTime()
    );
  });

  it('throws when updating non-existent todo', async () => {
    await expect(updateTodo({ id: 'nope', title: 'fail' })).rejects.toThrow(
      'Todo nope not found'
    );
  });

  it('deletes a todo', async () => {
    const created = await createTodo({ title: 'Delete me' });
    await deleteTodo(created.id);

    const todos = await listTodos();
    expect(todos).toHaveLength(0);
  });

  it('returns a copy from listTodos (immutability)', async () => {
    await createTodo({ title: 'Immutable' });
    const list1 = await listTodos();
    const list2 = await listTodos();

    expect(list1).toEqual(list2);
    expect(list1).not.toBe(list2); // Different array references
  });
});
