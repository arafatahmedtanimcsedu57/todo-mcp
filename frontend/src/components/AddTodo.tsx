import { useState } from 'react';

interface Props {
  onAdd: (title: string, due_date: string | null) => void;
}

export default function AddTodo({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, dueDate ? new Date(dueDate).toISOString() : null);
    setTitle('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 20px 10px 20px',
        borderBottom: '1px solid var(--rule)',
        position: 'relative',
      }}>
        <div style={{ width: '24px', flexShrink: 0 }} /> {/* margin spacer */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New entry..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: "'Courier Prime', monospace",
            fontSize: '15px',
            color: 'var(--ink)',
            lineHeight: '1.5',
          }}
        />
        <button
          type="submit"
          style={{
            background: 'var(--ink)',
            color: 'var(--paper)',
            border: 'none',
            fontFamily: "'Courier Prime', monospace",
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '5px 14px',
            cursor: 'pointer',
            borderRadius: '1px',
            transition: 'opacity 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Add
        </button>
      </div>

      {/* Due date row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 20px 10px 68px',
        borderBottom: '2px solid var(--rule)',
      }}>
        <span style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
        }}>
          Due date
        </span>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px dashed var(--rule)',
            outline: 'none',
            fontFamily: "'Courier Prime', monospace",
            fontSize: '12px',
            color: dueDate ? 'var(--blue)' : 'var(--ink-faint)',
            padding: '1px 4px',
            cursor: 'pointer',
          }}
        />
        {dueDate && (
          <button
            type="button"
            onClick={() => setDueDate('')}
            style={{
              background: 'none', border: 'none',
              fontFamily: "'Courier Prime', monospace",
              fontSize: '11px', color: 'var(--ink-faint)',
              cursor: 'pointer', letterSpacing: '0.05em',
            }}
          >
            clear
          </button>
        )}
      </div>
    </form>
  );
}
