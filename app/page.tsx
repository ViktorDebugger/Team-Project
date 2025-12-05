'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CalendarSearch } from 'lucide-react';
import { SidebarNav } from '@/components/sidebar';
import { WeekdayTabs, ScheduleList, ToggleGroup } from '@/components/schedule';
import {
  SearchModal,
  FavoritesModal,
  MakeupClassModal,
} from '@/components/modals';
import { UserData, USER_KEY } from '@/components/auth';
import { useSchedule, useFilters, useTheme } from '@/contexts';
import { useLocalStorage } from '@/hooks';

/** Subgroup options with short labels for mobile */
const SUBGROUP_OPTIONS = [
  { id: '1', label: 'I підгрупа', shortLabel: 'I' },
  { id: '2', label: 'II підгрупа', shortLabel: 'II' },
];

/** Week type options with short labels for mobile */
const WEEK_OPTIONS = [
  { id: 'numerator', label: 'По чисельнику', shortLabel: 'Чис.' },
  { id: 'denominator', label: 'По знаменнику', shortLabel: 'Знам.' },
];

/** Class type options with short labels for mobile */
const CLASS_TYPE_OPTIONS = [
  { id: 'all', label: 'Всі', shortLabel: 'Всі' },
  { id: 'Лекція', label: 'Лекції', shortLabel: 'Лек.' },
  { id: 'Практична', label: 'Практичні', shortLabel: 'Пр.' },
  { id: 'Лабораторна', label: 'Лаби', shortLabel: 'Лаб.' },
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useLocalStorage<UserData | null>(USER_KEY, null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isMakeupClassOpen, setIsMakeupClassOpen] = useState(false);
  const [makeupClassRefreshKey, setMakeupClassRefreshKey] = useState(0);

  // Use contexts
  const {
    selectedGroup,
    selectedTeacher,
    scheduleMode,
    viewMode,
    selectedDay,
  } = useSchedule();
  const {
    subgroup,
    weekType,
    classType,
    subjectSearch,
    setSubgroup,
    setWeekType,
    setClassType,
    setSubjectSearch,
  } = useFilters();
  const { bgColor } = useTheme();

  // Check authentication on mount
  useEffect(() => {
    if (user === null) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  // Show loading spinner while checking auth
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-purple-100">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  /** Current display name (group or teacher) */
  const displayName =
    scheduleMode === 'group' ? selectedGroup : selectedTeacher;

  /** Derived states from viewMode */
  const isExams = viewMode === 'exams';
  const showTabs = viewMode === 'classes-tabs';
  const showAllDays = viewMode === 'classes-list' || viewMode === 'exams';

  /** Check if user has no selection yet */
  const hasNoSelection =
    (scheduleMode === 'group' && !selectedGroup) ||
    (scheduleMode === 'teacher' && !selectedTeacher);

  return (
    <div
      className={`relative w-full min-h-screen transition-colors duration-300 ${bgColor}`}
    >
      {hasNoSelection ? (
        /* Empty state for new users */
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="bg-card rounded-2xl border shadow-lg p-8 max-w-md text-center">
            <CalendarSearch
              size={64}
              className="mx-auto text-primary/50 mb-6"
            />
            <h2 className="text-2xl font-bold mb-2">Ласкаво просимо!</h2>
            <p className="text-muted-foreground mb-6">
              Щоб переглянути розклад, спочатку оберіть свою групу або викладача
              через пошук.
            </p>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Search size={18} />
              <span>Знайти групу або викладача</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header with weekday tabs (only in classes-tabs mode) */}
          {showTabs && (
            <header className="flex justify-center pt-3 sm:pt-6 px-2 sm:px-0">
              <WeekdayTabs />
            </header>
          )}

          {/* Group/Teacher name */}
          <div className="flex flex-col items-center pt-3 sm:pt-4 gap-0.5 sm:gap-1">
            <span className="text-xs text-muted-foreground">
              {scheduleMode === 'group' ? 'Група' : 'Викладач'}
            </span>
            <h1 className="text-lg sm:text-xl font-semibold">{displayName}</h1>
            {isExams && (
              <span className="text-sm font-medium text-primary mt-1">
                Розклад екзаменів
              </span>
            )}
          </div>

          {/* Filters - only for classes */}
          {!isExams && (
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 pt-3 sm:pt-6 pb-2 sm:pb-4">
              {scheduleMode === 'group' && (
                <ToggleGroup
                  options={SUBGROUP_OPTIONS}
                  value={subgroup}
                  onChange={setSubgroup}
                />
              )}
              <ToggleGroup
                options={WEEK_OPTIONS}
                value={weekType}
                onChange={setWeekType}
              />
              <ToggleGroup
                options={CLASS_TYPE_OPTIONS}
                value={classType}
                onChange={setClassType}
              />
            </div>
          )}

          {/* Subject search */}
          <div className="flex justify-center px-2 sm:px-4 pb-2 sm:pb-4 pt-1 sm:pt-2">
            <div className="relative w-full max-w-3xl">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder={
                  isExams ? 'Пошук екзамену...' : 'Пошук дисципліни...'
                }
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Schedule list */}
          <main className="flex justify-center px-2 sm:px-4 pb-20 md:pb-8">
            <ScheduleList
              key={makeupClassRefreshKey}
              day={selectedDay}
              subgroup={scheduleMode === 'group' ? subgroup : undefined}
              weekType={weekType}
              showAllDays={showAllDays}
              subjectFilter={subjectSearch}
              teacherFilter={
                scheduleMode === 'teacher' ? selectedTeacher : undefined
              }
              scheduleType={isExams ? 'exams' : 'classes'}
              classTypeFilter={classType !== 'all' ? classType : undefined}
              currentTeacherName={
                user.role === 'teacher' ? user.name : undefined
              }
              selectedGroup={selectedGroup}
            />
          </main>
        </>
      )}

      {/* Sidebar navigation - bottom center on mobile, right side on desktop */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 md:bottom-auto md:top-1/4 md:-translate-y-1/2 z-50">
        <SidebarNav
          user={user}
          onLogout={handleLogout}
          onSearchClick={() => setIsSearchOpen(true)}
          isSearchOpen={isSearchOpen}
          onFavoritesClick={() => setIsFavoritesOpen(true)}
          isFavoritesOpen={isFavoritesOpen}
          onMakeupClassClick={() => setIsMakeupClassOpen(true)}
          isMakeupClassOpen={isMakeupClassOpen}
        />
      </div>

      {/* Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Favorites modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />

      {/* Makeup class modal - only for teachers */}
      {user.role === 'teacher' && (
        <MakeupClassModal
          isOpen={isMakeupClassOpen}
          onClose={() => setIsMakeupClassOpen(false)}
          teacherName={user.name}
          onCreated={() => setMakeupClassRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
