import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, error, addTodo, toggleTodo, deleteTodo } = useTodos();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', padding: '48px 16px 80px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Notebook cover header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: '10px' }}>
            {today}
          </p>
          <div style={{ borderTop: '2px solid var(--ink)', marginBottom: '8px' }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 8vw, 52px)', fontWeight: 900, letterSpacing: '-0.01em', lineHeight: 1, color: 'var(--ink)' }}>
            Todo List
          </h1>
          <div style={{ borderBottom: '2px solid var(--ink)', marginTop: '8px' }} />
          <div style={{ borderBottom: '1px solid var(--ink)', marginTop: '3px' }} />
        </div>

        {error && (
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: '13px', color: 'var(--red)', textAlign: 'center', marginBottom: '16px', fontStyle: 'italic' }}>
            ✕ {error}
          </p>
        )}

        {/* Notebook body */}
        <div style={{
          background: 'var(--paper-card)',
          boxShadow: '0 2px 12px rgba(28,24,20,0.10), 0 1px 3px rgba(28,24,20,0.07)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Left margin line */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '44px',
            borderLeft: '1.5px solid var(--margin)',
            pointerEvents: 'none', zIndex: 1,
          }} />

          <div style={{ padding: '20px 0 0' }}>
            <AddTodo onAdd={addTodo} />
          </div>

          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontFamily: "'Courier Prime', monospace", fontSize: '11px', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
          {todos.length} {todos.length === 1 ? 'entry' : 'entries'}
        </p>

      </div>
    </div>
  );
}

export default App;
