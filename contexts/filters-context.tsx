'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FiltersContextType {
  subgroup: string;
  weekType: string;
  classType: string;
  subjectSearch: string;
  setSubgroup: (value: string) => void;
  setWeekType: (value: string) => void;
  setClassType: (value: string) => void;
  setSubjectSearch: (value: string) => void;
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

  return (
    <FiltersContext.Provider
      value={{
        subgroup,
        weekType,
        classType,
        subjectSearch,
        setSubgroup,
        setWeekType,
        setClassType,
        setSubjectSearch,
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
