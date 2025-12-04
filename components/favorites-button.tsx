'use client';

import { Bookmark } from 'lucide-react';

interface FavoritesButtonProps {
  /** Callback when button is clicked */
  onClick: () => void;
  /** Whether the button is active (modal is open) */
  isActive?: boolean;
}

/**
 * Favorites button for opening saved items modal.
 * @param {FavoritesButtonProps} props - Component props
 * @returns {JSX.Element} Favorites button component
 * @example
 * <FavoritesButton onClick={() => setIsFavoritesOpen(true)} isActive={isFavoritesOpen} />
 */
export function FavoritesButton({
  onClick,
  isActive = false,
}: FavoritesButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted'
      }`}
      title="Збережені"
      aria-label="Збережені"
    >
      <Bookmark size={24} />
    </button>
  );
}
