'use client';

/** Toggle option type */
interface ToggleOption {
  id: string;
  label: string;
}

interface ToggleGroupProps {
  /** Available options */
  options: ToggleOption[];
  /** Currently selected option id */
  value: string;
  /** Callback when option is selected */
  onChange: (value: string) => void;
}

/**
 * Toggle group component for selecting between options.
 * @param {ToggleGroupProps} props - Component props
 * @returns {JSX.Element} Toggle group component
 * @example
 * <ToggleGroup
 *   options={[{ id: '1', label: 'Option 1' }, { id: '2', label: 'Option 2' }]}
 *   value={selected}
 *   onChange={setSelected}
 * />
 */
export function ToggleGroup({ options, value, onChange }: ToggleGroupProps) {
  return (
    <div className="inline-flex gap-1 p-1 bg-card rounded-xl border shadow-sm">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            value === option.id
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
