import AddTodo from '@/components/AddTodo';
import TodoList from '@/components/TodoList';
import { useTodos } from '@/hooks/useTodos';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

function App() {
  const { todos, error, addTodo, toggleTodo, deleteTodo } = useTodos();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen px-5 pt-14 pb-24 flex justify-center items-start">
      <div className="w-full max-w-140">

        {/* Header */}
        <header className="mb-10">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {today}
          </p>
          <h1 className="font-display text-[clamp(42px,10vw,64px)] font-light tracking-tight leading-none text-foreground">
            Todo List
          </h1>
          <Separator className="w-12 mt-5 bg-gold" />
        </header>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 mb-5 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Main card */}
        <Card className="overflow-hidden">
          <AddTodo onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        </Card>

        {/* Footer count */}
        <p className="mt-5 text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground text-right">
          {todos.length} {todos.length === 1 ? 'entry' : 'entries'}
        </p>

      </div>
    </div>
  );
}

export default App;
