import { Todo, CreateTodoInput, UpdateTodoInput } from './types.js';

const BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:3000';

export async function listTodos(): Promise<Todo[]> {
  const res = await fetch(`${BASE_URL}/todos`);
  if (!res.ok) throw new Error(`Failed to list todos: ${res.status} ${res.statusText}`);
  return res.json() as Promise<Todo[]>;
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to create todo: ${res.status} ${body}`);
  }
  return res.json() as Promise<Todo>;
}

export async function updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update todo ${id}: ${res.status} ${body}`);
  }
  return res.json() as Promise<Todo>;
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to delete todo ${id}: ${res.status} ${body}`);
  }
}
