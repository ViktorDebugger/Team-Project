'use client';

import { UserButton } from './user-button';
import { ViewModeButton } from './view-mode-button';
import { SearchButton } from './search-button';
import { FavoritesButton } from './favorites-button';
import { MakeupClassButton } from './makeup-class-button';
import { UserData } from '../auth';

interface SidebarNavProps {
  user: UserData;
  onLogout: () => void;
  onSearchClick: () => void;
  isSearchOpen: boolean;
  onFavoritesClick: () => void;
  isFavoritesOpen: boolean;
  onMakeupClassClick?: () => void;
  isMakeupClassOpen?: boolean;
}

export function SidebarNav({
  user,
  onLogout,
  onSearchClick,
  isSearchOpen,
  onFavoritesClick,
  isFavoritesOpen,
  onMakeupClassClick,
  isMakeupClassOpen,
}: SidebarNavProps) {
  const isTeacher = user.role === 'teacher';

  return (
    <nav className="flex flex-row md:flex-col gap-1 sm:gap-2 p-1.5 sm:p-2 bg-card rounded-xl border shadow-sm">
      <UserButton user={user} onLogout={onLogout} />
      <ViewModeButton />
      <SearchButton onClick={onSearchClick} isActive={isSearchOpen} />
      <FavoritesButton onClick={onFavoritesClick} isActive={isFavoritesOpen} />
      {isTeacher && onMakeupClassClick && (
        <MakeupClassButton
          onClick={onMakeupClassClick}
          isActive={isMakeupClassOpen || false}
        />
      )}
    </nav>
  );
}
