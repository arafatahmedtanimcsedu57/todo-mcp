import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DatePicker } from '@/components/ui/date-picker';

interface Props {
  onAdd: (title: string, due_date: string | null) => void;
}

export default function AddTodo({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, dueDate ? dueDate.toISOString() : null);
    setTitle('');
    setDueDate(undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          className="flex-1 border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground shadow-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="sm"
          className="shrink-0 bg-gold text-background font-bold text-[11px] tracking-[0.12em] uppercase hover:bg-gold-hover"
        >
          Add
        </Button>
      </div>

      <Separator />

      {/* Due date row */}
      <div className="flex items-center gap-2.5 px-5 py-2.5">
        <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted-foreground">
          Due
        </span>
        <DatePicker
          value={dueDate}
          onChange={setDueDate}
          placeholder="Pick a date"
        />
      </div>

      <Separator />
    </form>
  );
}
