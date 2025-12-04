'use client';

import { UserButton } from './user-button';
import { ColorButton } from './color-button';
import { ListButton } from './list-button';
import { SearchButton } from './search-button';
import { FavoritesButton } from './favorites-button';
import { ScheduleTypeButton } from './schedule-type-button';
import { UserData } from './auth-form';

/** Color option type */
interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

/** View mode type */
type ViewMode = 'tabs' | 'list';

/** Schedule type */
type ScheduleType = 'classes' | 'exams';

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
  scheduleType: ScheduleType;
  onScheduleTypeChange: (type: ScheduleType) => void;
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
  scheduleType,
  onScheduleTypeChange,
}: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-2 p-2 bg-card rounded-xl border shadow-sm">
      <UserButton user={user} onLogout={onLogout} />
      <ColorButton
        colors={colors}
        currentColor={currentColor}
        onColorChange={onColorChange}
      />
      <ListButton viewMode={viewMode} onViewModeChange={onViewModeChange} />
      <ScheduleTypeButton
        scheduleType={scheduleType}
        onScheduleTypeChange={onScheduleTypeChange}
      />
      <SearchButton onClick={onSearchClick} isActive={isSearchOpen} />
      <FavoritesButton onClick={onFavoritesClick} isActive={isFavoritesOpen} />
    </nav>
  );
}
