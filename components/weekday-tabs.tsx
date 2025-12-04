'use client';

/** Days of the week */
const WEEKDAYS = [
  { id: 'monday', label: 'Понеділок' },
  { id: 'tuesday', label: 'Вівторок' },
  { id: 'wednesday', label: 'Середа' },
  { id: 'thursday', label: 'Четвер' },
  { id: 'friday', label: "П'ятниця" },
];

interface WeekdayTabsProps {
  /** Currently selected day */
  selectedDay: string;
  /** Callback when day is selected */
  onDayChange: (day: string) => void;
}

/**
 * Tabs component for selecting days of the week.
 * @param {WeekdayTabsProps} props - Component props
 * @returns {JSX.Element} Weekday tabs component
 * @example
 * <WeekdayTabs selectedDay={selectedDay} onDayChange={setSelectedDay} />
 */
export function WeekdayTabs({ selectedDay, onDayChange }: WeekdayTabsProps) {
  return (
    <div className="inline-flex gap-2 p-2 bg-card rounded-2xl border shadow-sm">
      {WEEKDAYS.map((day) => (
        <button
          key={day.id}
          onClick={() => onDayChange(day.id)}
          className={`px-6 py-3 rounded-xl text-base font-medium transition-colors ${
            selectedDay === day.id
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
}
