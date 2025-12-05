'use client';

interface ToggleOption {
  id: string;
  label: string;
  shortLabel?: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export function ToggleGroup({ options, value, onChange }: ToggleGroupProps) {
  return (
    <div className="inline-flex gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-card rounded-lg sm:rounded-xl border shadow-sm">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
            value === option.id
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          <span className="hidden sm:inline">{option.label}</span>
          <span className="sm:hidden">{option.shortLabel || option.label}</span>
        </button>
      ))}
    </div>
  );
}
