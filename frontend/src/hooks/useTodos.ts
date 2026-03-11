import axios from 'axios';
import { useEffect, useState } from 'react';

const API = 'http://localhost:3000';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Todo[]>(`${API}/todos`)
      .then((res) => setTodos(res.data))
      .catch(() => setError('Failed to connect to backend.'));
  }, []);

  const addTodo = (title: string, due_date: string | null) =>
    axios.post<Todo>(`${API}/todos`, { title, due_date })
      .then((res) => setTodos((prev) => [res.data, ...prev]));

  const toggleTodo = (id: number, completed: boolean) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
    return axios.patch(`${API}/todos/${id}`, { completed });
  };

  const deleteTodo = (id: number) =>
    axios.delete(`${API}/todos/${id}`)
      .then(() => setTodos((prev) => prev.filter((t) => t.id !== id)));

  return { todos, error, addTodo, toggleTodo, deleteTodo };
}
