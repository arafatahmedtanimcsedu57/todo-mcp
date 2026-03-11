import { useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon, XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className }: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-7 justify-start gap-2 border-border bg-transparent px-2.5 text-xs font-normal',
                !value && 'text-muted-foreground'
              )}
            />
          }
        >
          <CalendarIcon className="size-3 text-muted-foreground" />
          {value ? format(value, 'MMM d, yyyy') : placeholder}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date)
              setOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onChange(undefined)}
          className="h-6 w-6 text-muted-foreground hover:text-danger hover:bg-transparent"
        >
          <XIcon className="size-3" />
        </Button>
      )}
    </div>
  )
}
