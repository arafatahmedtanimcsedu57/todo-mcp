export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
}

export interface CreateTodoInput {
  title: string;
  due_date?: string;
}

export interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
  due_date?: string | null;
}
