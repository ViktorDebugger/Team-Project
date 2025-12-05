'use client';

import { ReactNode } from 'react';
import {
  MobileProvider,
  ScheduleProvider,
  FiltersProvider,
  ThemeProvider,
} from '@/contexts';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <MobileProvider>
      <ThemeProvider>
        <ScheduleProvider>
          <FiltersProvider>{children}</FiltersProvider>
        </ScheduleProvider>
      </ThemeProvider>
    </MobileProvider>
  );
}
