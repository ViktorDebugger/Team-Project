'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { SidebarNav } from '@/components/sidebar-nav';
import { WeekdayTabs } from '@/components/weekday-tabs';
import { ScheduleList } from '@/components/schedule-list';
import { ToggleGroup } from '@/components/toggle-group';
import { SearchModal } from '@/components/search-modal';
import { FavoritesModal } from '@/components/favorites-modal';
import { UserData, USER_KEY } from '@/components/auth-form';
import { ViewMode } from '@/components/view-mode-button';

/** localStorage key for background color */
const BG_COLOR_KEY = 'bgColor';

/** localStorage key for selected group */
const GROUP_KEY = 'selectedGroup';

/** localStorage key for schedule mode */
const SCHEDULE_MODE_KEY = 'scheduleMode';

/** localStorage key for selected teacher */
const TEACHER_KEY = 'selectedTeacher';

/** localStorage key for view mode */
const VIEW_MODE_KEY = 'viewMode';

/** Default background color */
const DEFAULT_COLOR = 'bg-blue-200';

/** Default group */
const DEFAULT_GROUP = 'ОІ-35';

/** Schedule mode type */
type ScheduleMode = 'group' | 'teacher';

/** Available background color options */
const COLORS = [
  { name: 'Blue', value: 'bg-blue-200', hex: '#bfdbfe' },
  { name: 'Red', value: 'bg-red-200', hex: '#fecaca' },
  { name: 'Green', value: 'bg-green-200', hex: '#bbf7d0' },
  { name: 'Purple', value: 'bg-purple-200', hex: '#e9d5ff' },
  { name: 'Yellow', value: 'bg-yellow-200', hex: '#fef08a' },
  { name: 'Orange', value: 'bg-orange-200', hex: '#fed7aa' },
];

/** Subgroup options */
const SUBGROUP_OPTIONS = [
  { id: '1', label: 'I підгрупа' },
  { id: '2', label: 'II підгрупа' },
];

/** Week type options */
const WEEK_OPTIONS = [
  { id: 'numerator', label: 'По чисельнику' },
  { id: 'denominator', label: 'По знаменнику' },
];

/** Class type options */
const CLASS_TYPE_OPTIONS = [
  { id: 'all', label: 'Всі' },
  { id: 'Лекція', label: 'Лекції' },
  { id: 'Практична', label: 'Практичні' },
  { id: 'Лабораторна', label: 'Лаби' },
];

/**
 * Gets current day of the week as id.
 * @returns {string} Current day id (monday, tuesday, etc.)
 */
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
  // If weekend, default to monday
  if (today === 0 || today === 6) return 'monday';
  return days[today];
};

/**
 * Home page with sidebar navigation dropdowns.
 * @returns {JSX.Element} The home page component
 * @example
 * <Home />
 */
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bgColor, setBgColor] = useState(DEFAULT_COLOR);
  const [viewMode, setViewMode] = useState<ViewMode>('classes-tabs');
  const [selectedDay, setSelectedDay] = useState(getCurrentDay);
  const [subgroup, setSubgroup] = useState('1');
  const [weekType, setWeekType] = useState('numerator');
  const [selectedGroup, setSelectedGroup] = useState(DEFAULT_GROUP);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('group');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [classType, setClassType] = useState('all');

  // Check authentication and load settings from localStorage on mount
  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem(USER_KEY);
    if (!savedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(savedUser));

    // Load other settings
    const savedColor = localStorage.getItem(BG_COLOR_KEY);
    if (savedColor) {
      setBgColor(savedColor);
    }
    const savedGroup = localStorage.getItem(GROUP_KEY);
    if (savedGroup) {
      setSelectedGroup(savedGroup);
    }
    const savedMode = localStorage.getItem(SCHEDULE_MODE_KEY) as ScheduleMode;
    if (savedMode) {
      setScheduleMode(savedMode);
    }
    const savedTeacher = localStorage.getItem(TEACHER_KEY);
    if (savedTeacher) {
      setSelectedTeacher(savedTeacher);
    }
    const savedViewMode = localStorage.getItem(VIEW_MODE_KEY) as ViewMode;
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }

    setIsLoading(false);
  }, [router]);

  /**
   * Handles user logout.
   */
  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    router.push('/login');
  };

  /**
   * Handles color change and saves to localStorage.
   * @param {string} color - The new background color class
   */
  const handleColorChange = (color: string) => {
    setBgColor(color);
    localStorage.setItem(BG_COLOR_KEY, color);
  };

  /**
   * Handles group selection and saves to localStorage.
   * @param {string} group - The selected group name
   */
  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group);
    setScheduleMode('group');
    localStorage.setItem(GROUP_KEY, group);
    localStorage.setItem(SCHEDULE_MODE_KEY, 'group');
  };

  /**
   * Handles teacher selection and saves to localStorage.
   * @param {string} teacher - The selected teacher name
   */
  const handleTeacherSelect = (teacher: string) => {
    setSelectedTeacher(teacher);
    setScheduleMode('teacher');
    localStorage.setItem(TEACHER_KEY, teacher);
    localStorage.setItem(SCHEDULE_MODE_KEY, 'teacher');
  };

  /**
   * Handles view mode change and saves to localStorage.
   * @param {ViewMode} mode - The view mode
   */
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  // Show loading spinner while checking auth
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
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

  return (
    <div
      className={`relative w-full min-h-screen transition-colors duration-300 ${bgColor}`}
    >
      {/* Header with weekday tabs (only in classes-tabs mode) */}
      {showTabs && (
        <header className="flex justify-center pt-6">
          <WeekdayTabs selectedDay={selectedDay} onDayChange={setSelectedDay} />
        </header>
      )}

      {/* Group/Teacher name */}
      <div className="flex flex-col items-center pt-4 gap-1">
        <span className="text-xs text-muted-foreground">
          {scheduleMode === 'group' ? 'Група' : 'Викладач'}
        </span>
        <h1 className="text-xl font-semibold">{displayName}</h1>
        {isExams && (
          <span className="text-sm font-medium text-primary mt-1">
            Розклад екзаменів
          </span>
        )}
      </div>

      {/* Filters - only for classes */}
      {!isExams && (
        <div className="flex flex-wrap justify-center gap-2 px-4 pt-6 pb-4">
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
      <div className="flex justify-center px-4 pb-4 pt-2">
        <div className="relative w-full max-w-3xl">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder={isExams ? 'Пошук екзамену...' : 'Пошук дисципліни...'}
            value={subjectSearch}
            onChange={(e) => setSubjectSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Schedule list */}
      <main className="flex justify-center px-4 pb-8">
        <ScheduleList
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
        />
      </main>

      {/* Sidebar navigation - absolute positioned on the right */}
      <div className="fixed right-4 top-1/4 -translate-y-1/2">
        <SidebarNav
          user={user}
          onLogout={handleLogout}
          colors={COLORS}
          currentColor={bgColor}
          onColorChange={handleColorChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onSearchClick={() => setIsSearchOpen(true)}
          isSearchOpen={isSearchOpen}
          onFavoritesClick={() => setIsFavoritesOpen(true)}
          isFavoritesOpen={isFavoritesOpen}
        />
      </div>

      {/* Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentGroup={selectedGroup}
        currentTeacher={selectedTeacher}
        onGroupSelect={handleGroupSelect}
        onTeacherSelect={handleTeacherSelect}
      />

      {/* Favorites modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        currentGroup={selectedGroup}
        currentTeacher={selectedTeacher}
        onGroupSelect={handleGroupSelect}
        onTeacherSelect={handleTeacherSelect}
      />
    </div>
  );
}
