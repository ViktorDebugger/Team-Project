'use client';

import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserData } from '../auth';
import { useMobile, useTheme } from '@/contexts';

interface UserButtonProps {
  user: UserData;
  onLogout: () => void;
}

export function UserButton({ user, onLogout }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { bgColor, colors, setBgColor } = useTheme();

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
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
          title="Акаунт"
          aria-label="Акаунт"
        >
          <User size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? 'top' : 'left'}
        align={isMobile ? 'center' : 'start'}
        className="w-56"
      >
        <DropdownMenuLabel className="flex justify-between">
          <span className="font-semibold">{user.name}</span>
          <span className="text-xs text-muted-foreground italic">
            {user.role === 'student' ? 'студент' : 'викладач'}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Кольорова тема
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setBgColor(color.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                  bgColor === color.value
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Set background to ${color.name}`}
              />
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          <span>Вийти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
