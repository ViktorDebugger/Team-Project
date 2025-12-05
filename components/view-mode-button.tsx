'use client';

import { useState } from 'react';
import { CalendarDays, List, GraduationCap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/** Combined view mode type */
export type ViewMode = 'classes-tabs' | 'classes-list' | 'exams';

interface ViewModeButtonProps {
  /** Current view mode */
  viewMode: ViewMode;
  /** Callback when view mode changes */
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * Button for switching between classes (tabs/list) and exams view.
 * @param {ViewModeButtonProps} props - Component props
 * @returns {JSX.Element} View mode button with dropdown
 * @example
 * <ViewModeButton viewMode={viewMode} onViewModeChange={setViewMode} />
 */
export function ViewModeButton({
  viewMode,
  onViewModeChange,
}: ViewModeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  /** Get icon based on current view mode */
  const getIcon = () => {
    switch (viewMode) {
      case 'classes-tabs':
        return <CalendarDays size={24} />;
      case 'classes-list':
        return <List size={24} />;
      case 'exams':
        return <GraduationCap size={24} />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={`p-3 rounded-lg transition-colors ${
            isOpen
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
          title="Режим перегляду"
          aria-label="Режим перегляду"
        >
          {getIcon()}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="start" className="w-52">
        <DropdownMenuLabel>Режим перегляду</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onViewModeChange('classes-tabs')}
          className={`cursor-pointer gap-2 ${
            viewMode === 'classes-tabs' ? 'bg-muted' : ''
          }`}
        >
          <CalendarDays size={16} />
          <span>Пари (таби)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onViewModeChange('classes-list')}
          className={`cursor-pointer gap-2 ${
            viewMode === 'classes-list' ? 'bg-muted' : ''
          }`}
        >
          <List size={16} />
          <span>Пари (список)</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onViewModeChange('exams')}
          className={`cursor-pointer gap-2 ${
            viewMode === 'exams' ? 'bg-muted' : ''
          }`}
        >
          <GraduationCap size={16} />
          <span>Екзамени</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
