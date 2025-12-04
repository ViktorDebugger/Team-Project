'use client';

import { useState } from 'react';
import { CalendarDays, GraduationCap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/** Schedule type */
type ScheduleType = 'classes' | 'exams';

interface ScheduleTypeButtonProps {
  /** Current schedule type */
  scheduleType: ScheduleType;
  /** Callback when schedule type changes */
  onScheduleTypeChange: (type: ScheduleType) => void;
}

/**
 * Button for switching between classes and exams schedule.
 * @param {ScheduleTypeButtonProps} props - Component props
 * @returns {JSX.Element} Schedule type button with dropdown
 * @example
 * <ScheduleTypeButton scheduleType={scheduleType} onScheduleTypeChange={setScheduleType} />
 */
export function ScheduleTypeButton({
  scheduleType,
  onScheduleTypeChange,
}: ScheduleTypeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={`p-3 rounded-lg transition-colors ${
            isOpen
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
          title="Тип розкладу"
          aria-label="Тип розкладу"
        >
          {scheduleType === 'classes' ? (
            <CalendarDays size={24} />
          ) : (
            <GraduationCap size={24} />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start" className="w-48">
        <DropdownMenuLabel>Тип розкладу</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onScheduleTypeChange('classes')}
          className={`cursor-pointer gap-2 ${
            scheduleType === 'classes' ? 'bg-muted' : ''
          }`}
        >
          <CalendarDays size={16} />
          <span>Розклад пар</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onScheduleTypeChange('exams')}
          className={`cursor-pointer gap-2 ${
            scheduleType === 'exams' ? 'bg-muted' : ''
          }`}
        >
          <GraduationCap size={16} />
          <span>Розклад екзаменів</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
