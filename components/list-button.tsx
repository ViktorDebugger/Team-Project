'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/** View mode type */
type ViewMode = 'tabs' | 'list';

interface ListButtonProps {
  /** Current view mode */
  viewMode: ViewMode;
  /** Callback when view mode changes */
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * Settings button with view mode dropdown.
 * @param {ListButtonProps} props - Component props
 * @returns {JSX.Element} List button with dropdown
 * @example
 * <ListButton viewMode={viewMode} onViewModeChange={setViewMode} />
 */
export function ListButton({ viewMode, onViewModeChange }: ListButtonProps) {
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
          title="Налаштування"
          aria-label="Налаштування"
        >
          <SlidersHorizontal size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-48">
        <DropdownMenuLabel>Вигляд</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={`cursor-pointer ${viewMode === 'tabs' ? 'bg-muted' : ''}`}
          onClick={() => onViewModeChange('tabs')}
        >
          Вигляд у табах
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`cursor-pointer ${viewMode === 'list' ? 'bg-muted' : ''}`}
          onClick={() => onViewModeChange('list')}
        >
          Вигляд у списку
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
