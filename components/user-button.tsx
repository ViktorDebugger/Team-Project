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
import { UserData } from './auth-form';

/** Color option type */
interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

interface UserButtonProps {
  /** Current user data */
  user: UserData;
  /** Callback when user logs out */
  onLogout: () => void;
  /** Available color options */
  colors: ColorOption[];
  /** Current selected color */
  currentColor: string;
  /** Callback when color is selected */
  onColorChange: (color: string) => void;
}

/**
 * User account button with dropdown menu and color picker.
 * @param {UserButtonProps} props - Component props
 * @returns {JSX.Element} User button with dropdown
 * @example
 * <UserButton user={user} onLogout={handleLogout} colors={COLORS} currentColor={bgColor} onColorChange={setBgColor} />
 */
export function UserButton({
  user,
  onLogout,
  colors,
  currentColor,
  onColorChange,
}: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handles logout.
   */
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
      <DropdownMenuContent side="left" align="start" className="w-56">
        <DropdownMenuLabel className="flex justify-between">
          <span className="font-semibold">{user.name}</span>
          <span className="text-xs text-muted-foreground italic">
            {user.role === 'student' ? 'студент' : 'викладач'}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Color picker */}
        <div className="px-2 py-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Кольорова тема
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => onColorChange(color.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                  currentColor === color.value
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
