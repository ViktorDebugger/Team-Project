'use client';

import { UserButton } from './user-button';
import { ViewModeButton, ViewMode } from './view-mode-button';
import { SearchButton } from './search-button';
import { FavoritesButton } from './favorites-button';
import { MakeupClassButton } from './makeup-class-button';
import { UserData } from './auth-form';

/** Color option type */
interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

interface SidebarNavProps {
  user: UserData;
  onLogout: () => void;
  colors: ColorOption[];
  currentColor: string;
  onColorChange: (color: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchClick: () => void;
  isSearchOpen: boolean;
  onFavoritesClick: () => void;
  isFavoritesOpen: boolean;
  onMakeupClassClick?: () => void;
  isMakeupClassOpen?: boolean;
}

/**
 * Sidebar navigation with dropdown buttons.
 * @param {SidebarNavProps} props - Component props
 * @returns {JSX.Element} Sidebar navigation component
 */
export function SidebarNav({
  user,
  onLogout,
  colors,
  currentColor,
  onColorChange,
  viewMode,
  onViewModeChange,
  onSearchClick,
  isSearchOpen,
  onFavoritesClick,
  isFavoritesOpen,
  onMakeupClassClick,
  isMakeupClassOpen,
}: SidebarNavProps) {
  const isTeacher = user.role === 'teacher';

  return (
    <nav className="flex flex-col gap-2 p-2 bg-card rounded-xl border shadow-sm">
      <UserButton
        user={user}
        onLogout={onLogout}
        colors={colors}
        currentColor={currentColor}
        onColorChange={onColorChange}
      />
      <ViewModeButton viewMode={viewMode} onViewModeChange={onViewModeChange} />
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
