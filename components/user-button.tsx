'use client';

import { useState } from 'react';
import { User, LogOut, Bell, BellOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserData } from './auth-form';

interface UserButtonProps {
  /** Current user data */
  user: UserData;
  /** Callback when user logs out */
  onLogout: () => void;
}

/**
 * User account button with dropdown menu.
 * @param {UserButtonProps} props - Component props
 * @returns {JSX.Element} User button with dropdown
 * @example
 * <UserButton user={user} onLogout={handleLogout} />
 */
export function UserButton({ user, onLogout }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  /**
   * Toggles notifications on/off.
   */
  const handleToggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

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
        <DropdownMenuItem
          className="cursor-pointer flex justify-between"
          onClick={handleToggleNotifications}
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-2">
            {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            <span>Сповіщення</span>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              notificationsEnabled
                ? 'bg-green-100 text-green-700'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {notificationsEnabled ? 'Увімк.' : 'Вимк.'}
          </span>
        </DropdownMenuItem>
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
