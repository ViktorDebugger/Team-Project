'use client';

import { Search } from 'lucide-react';

interface SearchButtonProps {
  /** Callback when button is clicked */
  onClick: () => void;
  /** Whether the button is active (modal is open) */
  isActive?: boolean;
}

/**
 * Search button for opening group search modal.
 * @param {SearchButtonProps} props - Component props
 * @returns {JSX.Element} Search button component
 * @example
 * <SearchButton onClick={() => setIsSearchOpen(true)} isActive={isSearchOpen} />
 */
export function SearchButton({ onClick, isActive = false }: SearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted'
      }`}
      title="Пошук групи"
      aria-label="Пошук групи"
    >
      <Search size={24} />
    </button>
  );
}
