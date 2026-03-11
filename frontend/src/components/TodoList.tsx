import TodoItem from './TodoItem';

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
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        fontFamily: "'Courier Prime', monospace",
        fontSize: '13px',
        fontStyle: 'italic',
        color: 'var(--ink-faint)',
        letterSpacing: '0.05em',
      }}>
        — no entries yet —
      </div>
    );
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {todos.map((todo, i) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          style={{ animationDelay: `${i * 30}ms` } as React.CSSProperties}
        />
      ))}
    </ul>
  );
}
