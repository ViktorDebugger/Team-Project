'use client';

import { useSchedule } from '@/contexts';

const WEEKDAYS = [
  { id: 'monday', label: 'Понеділок', shortLabel: 'Пн' },
  { id: 'tuesday', label: 'Вівторок', shortLabel: 'Вт' },
  { id: 'wednesday', label: 'Середа', shortLabel: 'Ср' },
  { id: 'thursday', label: 'Четвер', shortLabel: 'Чт' },
  { id: 'friday', label: "П'ятниця", shortLabel: 'Пт' },
];

export function WeekdayTabs() {
  const { selectedDay, setSelectedDay } = useSchedule();

  return (
    <div className="inline-flex gap-1 sm:gap-2 p-1.5 sm:p-2 bg-card rounded-xl sm:rounded-2xl border shadow-sm">
      {WEEKDAYS.map((day) => (
        <button
          key={day.id}
          onClick={() => setSelectedDay(day.id)}
          className={`px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-colors ${
            selectedDay === day.id
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          <span className="hidden sm:inline">{day.label}</span>
          <span className="sm:hidden">{day.shortLabel}</span>
        </button>
      ))}
    </div>
  );
}
