interface Todo {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
}

interface Props {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  style?: React.CSSProperties;
}

function getStatus(todo: Todo): 'completed' | 'failed' | 'active' {
  if (todo.completed) return 'completed';
  if (todo.due_date && new Date(todo.due_date) < new Date()) return 'failed';
  return 'active';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TodoItem({ todo, onToggle, onDelete, style: extraStyle }: Props) {
  const status = getStatus(todo);

  return (
    <li className="task-row" style={{
      ...extraStyle,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '11px 20px',
      borderBottom: '1px solid var(--rule)',
      position: 'relative',
      transition: 'background 0.1s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(28,24,20,0.018)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Margin spacer (matches margin line position) */}
      <div style={{ width: '24px', flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: '3px' }}>
        <input
          type="checkbox"
          className="task-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: '15px',
          lineHeight: '1.5',
          color: status === 'completed' ? 'var(--ink-faint)' : status === 'failed' ? 'var(--red)' : 'var(--ink)',
          textDecoration: status === 'completed' ? 'line-through' : 'none',
          wordBreak: 'break-word',
        }}>
          {todo.title}
        </span>

        {/* Due date annotation */}
        {todo.due_date && status !== 'completed' && (
          <div style={{
            marginTop: '2px',
            fontFamily: "'Courier Prime', monospace",
            fontSize: '11px',
            fontStyle: 'italic',
            color: status === 'failed' ? 'var(--red)' : 'var(--ink-faint)',
            letterSpacing: '0.04em',
          }}>
            {status === 'failed' ? '⚑ ' : '○ '}due {formatDate(todo.due_date)}
          </div>
        )}
      </div>

      {/* Status stamp */}
      <div style={{ flexShrink: 0, paddingTop: '2px' }}>
        {status === 'completed' && <span className="stamp stamp-done">Done</span>}
        {status === 'failed'    && <span className="stamp stamp-failed">Failed</span>}
        {status === 'active' && todo.due_date && (
          <span className="stamp stamp-due">{formatDate(todo.due_date)}</span>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: 'none', border: 'none',
          color: 'var(--rule)',
          cursor: 'pointer',
          fontSize: '15px',
          lineHeight: 1,
          padding: '2px 0 0',
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--rule)')}
        title="Delete"
      >
        ✕
      </button>
    </li>
  );
}
