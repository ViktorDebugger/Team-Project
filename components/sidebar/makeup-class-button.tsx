'use client';

import { Plus } from 'lucide-react';

interface MakeupClassButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export function MakeupClassButton({
  isActive,
  onClick,
}: MakeupClassButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-green-600 text-white'
          : 'text-muted-foreground hover:bg-muted'
      }`}
      title="Призначити відпрацювання"
      aria-label="Призначити відпрацювання"
    >
      <Plus size={24} />
    </button>
  );
}
