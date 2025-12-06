'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks';

interface FiltersContextType {
  subgroup: string;
  weekType: string;
  classType: string;
  subjectSearch: string;
  savedGroups: string[];
  savedTeachers: string[];
  setSubgroup: (value: string) => void;
  setWeekType: (value: string) => void;
  setClassType: (value: string) => void;
  setSubjectSearch: (value: string) => void;
  setSavedGroups: React.Dispatch<React.SetStateAction<string[]>>;
  setSavedTeachers: React.Dispatch<React.SetStateAction<string[]>>;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

interface FiltersProviderProps {
  children: ReactNode;
}

export function FiltersProvider({ children }: FiltersProviderProps) {
  const [subgroup, setSubgroup] = useState('1');
  const [weekType, setWeekType] = useState('numerator');
  const [classType, setClassType] = useState('all');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [savedGroups, setSavedGroups] = useLocalStorage<string[]>(
    'savedGroups',
    []
  );
  const [savedTeachers, setSavedTeachers] = useLocalStorage<string[]>(
    'savedTeachers',
    []
  );

  return (
    <FiltersContext.Provider
      value={{
        subgroup,
        weekType,
        classType,
        subjectSearch,
        savedGroups,
        savedTeachers,
        setSubgroup,
        setWeekType,
        setClassType,
        setSubjectSearch,
        setSavedGroups,
        setSavedTeachers,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters(): FiltersContextType {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}
