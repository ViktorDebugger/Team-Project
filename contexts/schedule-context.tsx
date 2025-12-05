'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks';

export type ViewMode = 'classes-tabs' | 'classes-list' | 'exams';

const GROUP_KEY = 'selectedGroup';
const TEACHER_KEY = 'selectedTeacher';
const SCHEDULE_MODE_KEY = 'scheduleMode';
const VIEW_MODE_KEY = 'viewMode';

type ScheduleMode = 'group' | 'teacher';

interface ScheduleContextType {
  selectedGroup: string;
  selectedTeacher: string;
  scheduleMode: ScheduleMode;
  viewMode: ViewMode;
  selectedDay: string;
  setSelectedGroup: (group: string) => void;
  setSelectedTeacher: (teacher: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedDay: (day: string) => void;
  selectGroup: (group: string) => void;
  selectTeacher: (teacher: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

const getCurrentDay = (): string => {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const today = new Date().getDay();
  if (today === 0 || today === 6) return 'monday';
  return days[today];
};

interface ScheduleProviderProps {
  children: ReactNode;
}

export function ScheduleProvider({ children }: ScheduleProviderProps) {
  const [selectedGroup, setSelectedGroup] = useLocalStorage(GROUP_KEY, '');
  const [selectedTeacher, setSelectedTeacher] = useLocalStorage(
    TEACHER_KEY,
    ''
  );
  const [scheduleMode, setScheduleMode] = useLocalStorage<ScheduleMode>(
    SCHEDULE_MODE_KEY,
    'group'
  );
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    VIEW_MODE_KEY,
    'classes-tabs'
  );
  const [selectedDay, setSelectedDay] = useState(getCurrentDay);

  const selectGroup = (group: string) => {
    setSelectedGroup(group);
    setScheduleMode('group');
  };

  const selectTeacher = (teacher: string) => {
    setSelectedTeacher(teacher);
    setScheduleMode('teacher');
  };

  return (
    <ScheduleContext.Provider
      value={{
        selectedGroup,
        selectedTeacher,
        scheduleMode,
        viewMode,
        selectedDay,
        setSelectedGroup,
        setSelectedTeacher,
        setViewMode,
        setSelectedDay,
        selectGroup,
        selectTeacher,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule(): ScheduleContextType {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
