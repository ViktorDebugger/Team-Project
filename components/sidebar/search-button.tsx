'use client';

import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

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
