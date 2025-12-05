'use client';

import { Plus } from 'lucide-react';

interface MakeupClassButtonProps {
  /** Whether the button is active */
  isActive: boolean;
  /** Click handler */
  onClick: () => void;
}

/**
 * Button for opening the makeup class modal.
 * @param {MakeupClassButtonProps} props - Component props
 * @returns {JSX.Element} Makeup class button
 * @example
 * <MakeupClassButton isActive={isModalOpen} onClick={() => setIsModalOpen(true)} />
 */
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
