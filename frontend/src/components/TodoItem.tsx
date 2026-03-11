import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

const titleClass = {
  completed: 'text-muted-foreground line-through decoration-muted-foreground',
  failed: 'text-danger',
  active: 'text-foreground',
} as const;

export default function TodoItem({ todo, onToggle, onDelete, style: extraStyle }: Props) {
  const status = getStatus(todo);

  return (
    <li
      className="task-row group flex items-start gap-3.5 px-5 py-3.5 border-b border-border transition-colors duration-200 hover:bg-secondary"
      style={extraStyle}
    >
      {/* Checkbox */}
      <div className="pt-0.5 shrink-0">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id, !todo.completed)}
          className="border-muted-foreground data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-background"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span className={`text-sm leading-relaxed wrap-break-word transition-colors duration-200 ${titleClass[status]}`}>
          {todo.title}
        </span>

        {/* Due date annotation */}
        {todo.due_date && status !== 'completed' && (
          <p className={`mt-1 text-[11px] font-medium tracking-wide ${status === 'failed' ? 'text-danger-dim' : 'text-muted-foreground'}`}>
            {status === 'failed' ? 'Overdue — ' : 'Due '}{formatDate(todo.due_date)}
          </p>
        )}
      </div>

      {/* Status badge */}
      <div className="shrink-0 pt-0.5">
        {status === 'completed' && (
          <Badge variant="outline" className="border-success/30 bg-success/10 text-success text-[10px] tracking-widest uppercase">
            Done
          </Badge>
        )}
        {status === 'failed' && (
          <Badge variant="outline" className="border-danger/30 bg-danger/10 text-danger text-[10px] tracking-widest uppercase">
            Overdue
          </Badge>
        )}
        {status === 'active' && todo.due_date && (
          <Badge variant="outline" className="border-gold/30 bg-gold/8 text-gold text-[10px] tracking-widest uppercase">
            {formatDate(todo.due_date)}
          </Badge>
        )}
      </div>

      {/* Delete */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="shrink-0 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-danger hover:bg-transparent"
        title="Delete"
      >
        <span className="text-sm leading-none">✕</span>
      </Button>
    </li>
  );
}
