import TodoItem from '@/components/TodoItem';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
}

interface Props {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="px-5 py-14 text-center">
        <p className="font-display text-lg font-light italic text-muted-foreground tracking-wide">
          — no entries yet —
        </p>
      </div>
    );
  }

  return (
    <ul className="list-none p-0 m-0">
      {todos.map((todo, i) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          style={{ animationDelay: `${i * 40}ms` }}
        />
      ))}
    </ul>
  );
}
