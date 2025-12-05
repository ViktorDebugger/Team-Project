'use client';

import { Bookmark } from 'lucide-react';

interface FavoritesButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

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
