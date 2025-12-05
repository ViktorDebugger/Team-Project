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
import { useMobile, useSchedule } from '@/contexts';

export function ViewModeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { viewMode, setViewMode } = useSchedule();

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
      <DropdownMenuContent
        side={isMobile ? 'top' : 'left'}
        align={isMobile ? 'center' : 'start'}
        className="w-52"
      >
        <DropdownMenuLabel>Режим перегляду</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setViewMode('classes-tabs')}
          className={`cursor-pointer gap-2 ${
            viewMode === 'classes-tabs' ? 'bg-muted' : ''
          }`}
        >
          <CalendarDays size={16} />
          <span>Пари (таби)</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setViewMode('classes-list')}
          className={`cursor-pointer gap-2 ${
            viewMode === 'classes-list' ? 'bg-muted' : ''
          }`}
        >
          <List size={16} />
          <span>Пари (список)</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setViewMode('exams')}
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
