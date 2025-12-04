'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/** Color option type */
interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

interface ColorButtonProps {
  /** Available color options */
  colors: ColorOption[];
  /** Current selected color */
  currentColor: string;
  /** Callback when color is selected */
  onColorChange: (color: string) => void;
}

/**
 * Color theme button with color picker dropdown.
 * @param {ColorButtonProps} props - Component props
 * @returns {JSX.Element} Color button with dropdown
 * @example
 * <ColorButton colors={COLORS} currentColor={bgColor} onColorChange={setBgColor} />
 */
export function ColorButton({
  colors,
  currentColor,
  onColorChange,
}: ColorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className={`p-3 rounded-lg transition-colors ${
            isOpen
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
          title="Тема"
          aria-label="Тема"
        >
          <Palette size={24} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-48 p-3">
        <DropdownMenuLabel className="px-0">Кольорова тема</DropdownMenuLabel>
        <div className="flex flex-wrap gap-2 mt-2">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                currentColor === color.value
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-border'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Set background to ${color.name}`}
            />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
