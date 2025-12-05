'use client';

import { useState, useEffect } from 'react';
import {
  XCircle,
  RotateCcw,
  AlertCircle,
  Video,
  ExternalLink,
  UserCheck,
  Plus,
} from 'lucide-react';
import scheduleData from '@/data/schedule.json';
import examsData from '@/data/exams.json';
import {
  CancelClassModal,
  CancelledClass,
  CANCELLED_CLASSES_KEY,
} from './cancel-class-modal';
import {
  OnlineClassModal,
  OnlineClass,
  ONLINE_CLASSES_KEY,
} from './online-class-modal';
import {
  SubstituteModal,
  SubstitutedClass,
  SUBSTITUTED_CLASSES_KEY,
} from './substitute-modal';
import { MakeupClass, MAKEUP_CLASSES_KEY } from './makeup-class-modal';

/** Schedule item type */
interface ScheduleItem {
  id: string;
  number: number;
  timeStart: string;
  timeEnd: string;
  subject: string;
  type: string;
  teacher: string;
  room: string;
  subgroup: string | null;
  weekType: string | null;
  groups?: string[];
}

/** Exam item type */
interface ExamItem {
  id: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  subject: string;
  type: string;
  teacher: string;
  room: string;
}

/** Schedule data type */
type ScheduleData = {
  [key: string]: ScheduleItem[];
};

/** Schedule type */
type ScheduleType = 'classes' | 'exams';

/** Day names in Ukrainian */
const DAY_NAMES: { [key: string]: string } = {
  monday: 'Понеділок',
  tuesday: 'Вівторок',
  wednesday: 'Середа',
  thursday: 'Четвер',
  friday: "П'ятниця",
};

/** Days order */
const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

interface ScheduleListProps {
  day?: string;
  subgroup?: string;
  weekType?: string;
  showAllDays?: boolean;
  subjectFilter?: string;
  teacherFilter?: string;
  scheduleType?: ScheduleType;
  classTypeFilter?: string;
  /** Name of the logged-in teacher (if user is a teacher) - enables cancel buttons on their classes */
  currentTeacherName?: string;
  /** Currently selected group for filtering makeup classes */
  selectedGroup?: string;
}

/**
 * Filters schedule items by subgroup, weekType, subject, teacher, and class type.
 */
const filterSchedule = (
  items: ScheduleItem[],
  subgroup?: string,
  weekType?: string,
  subjectFilter?: string,
  teacherFilter?: string,
  classTypeFilter?: string
): ScheduleItem[] => {
  return items.filter((item) => {
    if (
      !teacherFilter &&
      item.subgroup &&
      subgroup &&
      item.subgroup !== subgroup
    ) {
      return false;
    }
    if (item.weekType && weekType && item.weekType !== weekType) {
      return false;
    }
    if (
      subjectFilter &&
      !item.subject.toLowerCase().includes(subjectFilter.toLowerCase())
    ) {
      return false;
    }
    if (teacherFilter && item.teacher !== teacherFilter) {
      return false;
    }
    if (classTypeFilter && item.type !== classTypeFilter) {
      return false;
    }
    return true;
  });
};

/**
 * Filters exam items by subject and teacher.
 */
const filterExams = (
  items: ExamItem[],
  subjectFilter?: string,
  teacherFilter?: string
): ExamItem[] => {
  return items.filter((item) => {
    if (
      subjectFilter &&
      !item.subject.toLowerCase().includes(subjectFilter.toLowerCase())
    ) {
      return false;
    }
    if (teacherFilter && item.teacher !== teacherFilter) {
      return false;
    }
    return true;
  });
};

/**
 * Formats date to Ukrainian format.
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString('uk-UA', options);
};

/**
 * Schedule list component displaying classes or exams.
 */
export function ScheduleList({
  day,
  subgroup,
  weekType,
  showAllDays = false,
  subjectFilter,
  teacherFilter,
  scheduleType = 'classes',
  classTypeFilter,
  currentTeacherName,
  selectedGroup,
}: ScheduleListProps) {
  const data = scheduleData as ScheduleData;
  const exams = examsData as ExamItem[];

  const [cancelledClasses, setCancelledClasses] = useState<CancelledClass[]>(
    []
  );
  const [onlineClasses, setOnlineClasses] = useState<OnlineClass[]>([]);
  const [substitutedClasses, setSubstitutedClasses] = useState<
    SubstitutedClass[]
  >([]);
  const [makeupClasses, setMakeupClasses] = useState<MakeupClass[]>([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [onlineModalOpen, setOnlineModalOpen] = useState(false);
  const [substituteModalOpen, setSubstituteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    id: string;
    day: string;
    subject: string;
    time: string;
  } | null>(null);

  // Load cancelled, online, substituted, and makeup classes from localStorage
  useEffect(() => {
    const loadData = () => {
      const savedCancelled = localStorage.getItem(CANCELLED_CLASSES_KEY);
      if (savedCancelled) {
        setCancelledClasses(JSON.parse(savedCancelled));
      }
      const savedOnline = localStorage.getItem(ONLINE_CLASSES_KEY);
      if (savedOnline) {
        setOnlineClasses(JSON.parse(savedOnline));
      }
      const savedSubstituted = localStorage.getItem(SUBSTITUTED_CLASSES_KEY);
      if (savedSubstituted) {
        setSubstitutedClasses(JSON.parse(savedSubstituted));
      }
      const savedMakeup = localStorage.getItem(MAKEUP_CLASSES_KEY);
      if (savedMakeup) {
        setMakeupClasses(JSON.parse(savedMakeup));
      }
    };
    loadData();

    // Listen for storage changes
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  /**
   * Checks if a class is cancelled.
   */
  const getCancelledInfo = (
    classId: string,
    dayKey: string
  ): CancelledClass | undefined => {
    return cancelledClasses.find(
      (c) => c.classId === classId && c.day === dayKey
    );
  };

  /**
   * Checks if a class is online.
   */
  const getOnlineInfo = (
    classId: string,
    dayKey: string
  ): OnlineClass | undefined => {
    return onlineClasses.find((c) => c.classId === classId && c.day === dayKey);
  };

  /**
   * Checks if a class has a substitute.
   */
  const getSubstitutedInfo = (
    classId: string,
    dayKey: string
  ): SubstitutedClass | undefined => {
    return substitutedClasses.find(
      (c) => c.classId === classId && c.day === dayKey
    );
  };

  /**
   * Opens the cancel modal for a class.
   */
  const handleCancelClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string,
    subject: string,
    time: string
  ) => {
    e.stopPropagation();
    setSelectedClass({ id: classId, day: dayKey, subject, time });
    setCancelModalOpen(true);
  };

  /**
   * Opens the online modal for a class.
   */
  const handleOnlineClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string,
    subject: string,
    time: string
  ) => {
    e.stopPropagation();
    setSelectedClass({ id: classId, day: dayKey, subject, time });
    setOnlineModalOpen(true);
  };

  /**
   * Removes online status from a class.
   */
  const handleRemoveOnlineClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string
  ) => {
    e.stopPropagation();
    const updated = onlineClasses.filter(
      (c) => !(c.classId === classId && c.day === dayKey)
    );
    setOnlineClasses(updated);
    localStorage.setItem(ONLINE_CLASSES_KEY, JSON.stringify(updated));
  };

  /**
   * Restores a cancelled class.
   */
  const handleRestoreClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string
  ) => {
    e.stopPropagation();
    const updated = cancelledClasses.filter(
      (c) => !(c.classId === classId && c.day === dayKey)
    );
    setCancelledClasses(updated);
    localStorage.setItem(CANCELLED_CLASSES_KEY, JSON.stringify(updated));
  };

  /**
   * Refreshes cancelled classes after a new cancellation.
   */
  const handleCancelled = () => {
    const saved = localStorage.getItem(CANCELLED_CLASSES_KEY);
    if (saved) {
      setCancelledClasses(JSON.parse(saved));
    }
  };

  /**
   * Refreshes online classes after update.
   */
  const handleOnlineUpdated = () => {
    const saved = localStorage.getItem(ONLINE_CLASSES_KEY);
    if (saved) {
      setOnlineClasses(JSON.parse(saved));
    }
  };

  /**
   * Opens the substitute modal for a class.
   */
  const handleSubstituteClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string,
    subject: string,
    time: string
  ) => {
    e.stopPropagation();
    setSelectedClass({ id: classId, day: dayKey, subject, time });
    setSubstituteModalOpen(true);
  };

  /**
   * Removes substitute from a class.
   */
  const handleRemoveSubstituteClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string
  ) => {
    e.stopPropagation();
    const updated = substitutedClasses.filter(
      (c) => !(c.classId === classId && c.day === dayKey)
    );
    setSubstitutedClasses(updated);
    localStorage.setItem(SUBSTITUTED_CLASSES_KEY, JSON.stringify(updated));
  };

  /**
   * Refreshes substituted classes after update.
   */
  const handleSubstituteUpdated = () => {
    const saved = localStorage.getItem(SUBSTITUTED_CLASSES_KEY);
    if (saved) {
      setSubstitutedClasses(JSON.parse(saved));
    }
  };

  // Render exams list
  if (scheduleType === 'exams') {
    const filteredExams = filterExams(exams, subjectFilter, teacherFilter);

    if (filteredExams.length === 0) {
      return (
        <div className="w-full max-w-3xl">
          <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
            <p className="text-muted-foreground">
              {subjectFilter
                ? 'Екзамен не знайдено'
                : teacherFilter
                  ? 'Немає екзаменів у цього викладача'
                  : 'Немає запланованих екзаменів'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-3xl space-y-3">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-card rounded-xl border shadow-sm p-4"
          >
            {/* Header: Date + Time */}
            <div className="flex justify-between items-start mb-3">
              <span className="text-lg font-medium capitalize">
                {formatDate(exam.date)}
              </span>
              <span className="text-sm text-muted-foreground">
                {exam.timeStart}-{exam.timeEnd}
              </span>
            </div>

            {/* Subject */}
            <h3 className="text-xl font-semibold mb-3">{exam.subject}</h3>

            {/* Footer: Teacher + Type/Room */}
            <div className="flex justify-between items-end">
              <span className="text-muted-foreground">{exam.teacher}</span>
              <div className="text-right">
                <div
                  className={`text-sm font-medium ${
                    exam.type === 'Екзамен'
                      ? 'text-destructive'
                      : 'text-primary'
                  }`}
                >
                  {exam.type}
                </div>
                <div className="text-sm text-muted-foreground">{exam.room}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render a single class item
  const renderClassItem = (item: ScheduleItem, dayKey: string) => {
    const cancelledInfo = getCancelledInfo(item.id, dayKey);
    const onlineInfo = getOnlineInfo(item.id, dayKey);
    const substitutedInfo = getSubstitutedInfo(item.id, dayKey);
    const isCancelled = !!cancelledInfo;
    const isOnline = !!onlineInfo;
    const isSubstituted = !!substitutedInfo;

    return (
      <div
        key={item.id}
        className={`bg-card rounded-xl border shadow-sm p-4 relative ${
          isCancelled
            ? 'opacity-60 border-destructive/30'
            : isOnline
              ? 'border-primary/30'
              : isSubstituted
                ? 'border-orange-300'
                : ''
        }`}
      >
        {/* Status badges */}
        {isCancelled && (
          <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <XCircle size={12} />
            Відмінено
          </div>
        )}
        {isOnline && !isCancelled && (
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Video size={12} />
            Онлайн
          </div>
        )}
        {isSubstituted && !isCancelled && !isOnline && (
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <UserCheck size={12} />
            Заміна
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <span
            className={`text-lg font-medium ${isCancelled ? 'line-through' : ''}`}
          >
            {item.number} Пара
          </span>
          <span className="text-sm text-muted-foreground">
            {item.timeStart}-{item.timeEnd}
          </span>
        </div>

        <h3
          className={`text-xl font-semibold mb-3 ${isCancelled ? 'line-through' : ''}`}
        >
          {item.subject}
        </h3>

        {/* Cancelled message */}
        {isCancelled && cancelledInfo.message && (
          <div className="mb-3 p-2 bg-destructive/10 rounded-lg flex items-start gap-2">
            <AlertCircle
              size={16}
              className="text-destructive mt-0.5 shrink-0"
            />
            <p className="text-sm text-destructive">{cancelledInfo.message}</p>
          </div>
        )}

        {/* Online info with Meet link */}
        {isOnline && !isCancelled && (
          <div className="mb-3 p-2 bg-primary/10 rounded-lg space-y-1.5">
            <a
              href={onlineInfo.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Video size={14} />
              Приєднатися до Google Meet
              <ExternalLink size={12} />
            </a>
            {onlineInfo.message && (
              <p className="text-sm text-muted-foreground">
                {onlineInfo.message}
              </p>
            )}
          </div>
        )}

        {/* Substitute info */}
        {isSubstituted && !isCancelled && (
          <div className="mb-3 p-2 bg-orange-50 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-medium text-orange-700">
              <UserCheck size={14} />
              <span>Заміна: {substitutedInfo.substituteTeacher}</span>
            </div>
            {substitutedInfo.message && (
              <p className="text-sm text-orange-600/80">
                {substitutedInfo.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-end">
          <div className="text-muted-foreground">
            {teacherFilter ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">
                  {item.groups?.join(', ') || 'Група'}
                </span>
                <span className="text-sm">
                  {item.subgroup ? `Підгрупа ${item.subgroup}` : 'Вся група'}
                </span>
              </div>
            ) : isSubstituted ? (
              <div className="flex flex-col gap-0.5">
                <span className="line-through text-muted-foreground/60">
                  {item.teacher}
                </span>
                <span className="font-medium text-orange-700">
                  {substitutedInfo.substituteTeacher}
                </span>
              </div>
            ) : (
              item.teacher
            )}
          </div>
          <div className="flex items-end gap-2">
            {/* Action buttons for teachers - only on their own classes */}
            {currentTeacherName && item.teacher === currentTeacherName && (
              <>
                {isCancelled ? (
                  <button
                    onClick={(e) => handleRestoreClick(e, item.id, dayKey)}
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5 text-sm font-medium"
                    title="Відновити пару"
                  >
                    <RotateCcw size={14} />
                    <span>Відновити</span>
                  </button>
                ) : (
                  <>
                    {/* Online button */}
                    {isOnline ? (
                      <button
                        onClick={(e) =>
                          handleRemoveOnlineClick(e, item.id, dayKey)
                        }
                        className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1.5 text-sm font-medium"
                        title="Відмінити онлайн"
                      >
                        <Video size={14} />
                        <span>Відмінити онлайн</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) =>
                          handleOnlineClick(
                            e,
                            item.id,
                            dayKey,
                            item.subject,
                            `${item.timeStart}-${item.timeEnd}`
                          )
                        }
                        className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="Перенести онлайн"
                      >
                        <Video size={16} />
                      </button>
                    )}
                    {/* Substitute button */}
                    {isSubstituted ? (
                      <button
                        onClick={(e) =>
                          handleRemoveSubstituteClick(e, item.id, dayKey)
                        }
                        className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors flex items-center gap-1.5 text-sm font-medium"
                        title="Відмінити заміну"
                      >
                        <UserCheck size={14} />
                        <span>Відмінити заміну</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) =>
                          handleSubstituteClick(
                            e,
                            item.id,
                            dayKey,
                            item.subject,
                            `${item.timeStart}-${item.timeEnd}`
                          )
                        }
                        className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                        title="Призначити заміну"
                      >
                        <UserCheck size={16} />
                      </button>
                    )}
                    {/* Cancel button - only if not online and not substituted */}
                    {!isOnline && !isSubstituted && (
                      <button
                        onClick={(e) =>
                          handleCancelClick(
                            e,
                            item.id,
                            dayKey,
                            item.subject,
                            `${item.timeStart}-${item.timeEnd}`
                          )
                        }
                        className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        title="Відмінити пару"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            <div className="text-right">
              <div className="text-sm font-medium">{item.type}</div>
              <div className="text-sm text-muted-foreground">{item.room}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Gets makeup classes for a specific day filtered by group or teacher.
   */
  const getMakeupClassesForDay = (dayKey: string): MakeupClass[] => {
    return makeupClasses.filter((makeup) => {
      if (makeup.day !== dayKey) return false;

      // Filter by subject if provided
      if (
        subjectFilter &&
        !makeup.subject.toLowerCase().includes(subjectFilter.toLowerCase())
      ) {
        return false;
      }

      // Filter by class type if provided
      if (classTypeFilter && makeup.type !== classTypeFilter) {
        return false;
      }

      // If viewing a teacher's schedule, show their makeup classes
      if (teacherFilter) {
        return makeup.teacher === teacherFilter;
      }

      // If viewing a group's schedule, show makeup classes for that group
      if (selectedGroup) {
        return makeup.groups.includes(selectedGroup);
      }

      return true;
    });
  };

  /**
   * Renders a makeup class item.
   */
  const renderMakeupClassItem = (makeup: MakeupClass) => {
    const classTime = CLASS_TIMES.find((c) => c.number === makeup.classNumber);

    return (
      <div
        key={makeup.id}
        className="bg-lime-50 rounded-xl border border-lime-400 shadow-sm p-4 relative"
      >
        {/* Makeup badge */}
        <div className="absolute -top-2 -right-2 bg-lime-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Plus size={12} />
          Відпрацювання
        </div>

        {/* Online badge if applicable */}
        {makeup.isOnline && (
          <div className="absolute -top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Video size={12} />
            Онлайн
          </div>
        )}

        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            {makeup.classNumber} Пара
          </span>
          <span className="text-sm text-muted-foreground">
            {classTime?.time.replace('-', '-')}
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-2">{makeup.subject}</h3>

        {/* Message if provided */}
        {makeup.message && (
          <div className="mb-3 p-2 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{makeup.message}</p>
          </div>
        )}

        {/* Online link if applicable */}
        {makeup.isOnline && makeup.meetLink && (
          <div className="mb-3 p-2 bg-primary/10 rounded-lg">
            <a
              href={makeup.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink size={14} />
              <span className="text-sm font-medium">
                Приєднатися до Google Meet
              </span>
            </a>
          </div>
        )}

        <div className="flex justify-between items-end">
          <div className="text-muted-foreground">
            {teacherFilter ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground">
                  {makeup.groups.join(', ')}
                </span>
              </div>
            ) : (
              makeup.teacher
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">{makeup.type}</div>
            <div className="text-sm text-muted-foreground">
              {makeup.isOnline ? 'Онлайн' : makeup.room}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Class times for reference
  const CLASS_TIMES = [
    { number: 1, time: '8:30-9:50' },
    { number: 2, time: '10:05-11:25' },
    { number: 3, time: '11:40-13:00' },
    { number: 4, time: '13:30-14:50' },
    { number: 5, time: '15:05-16:25' },
    { number: 6, time: '16:40-18:00' },
    { number: 7, time: '18:15-19:35' },
    { number: 8, time: '19:50-21:10' },
  ];

  // Render classes schedule
  const renderDaySchedule = (dayKey: string, items: ScheduleItem[]) => {
    const filteredSchedule = filterSchedule(
      items,
      subgroup,
      weekType,
      subjectFilter,
      teacherFilter,
      classTypeFilter
    );

    const dayMakeupClasses = getMakeupClassesForDay(dayKey);

    if (filteredSchedule.length === 0 && dayMakeupClasses.length === 0) {
      return null;
    }

    // Combine and sort by class number
    type CombinedItem =
      | { type: 'regular'; data: ScheduleItem; number: number }
      | { type: 'makeup'; data: MakeupClass; number: number };

    const combinedItems: CombinedItem[] = [
      ...filteredSchedule.map((item) => ({
        type: 'regular' as const,
        data: item,
        number: item.number,
      })),
      ...dayMakeupClasses.map((makeup) => ({
        type: 'makeup' as const,
        data: makeup,
        number: makeup.classNumber,
      })),
    ].sort((a, b) => a.number - b.number);

    return (
      <div key={dayKey} className="space-y-3">
        {showAllDays && (
          <h2 className="text-lg font-semibold text-foreground/80 pt-2">
            {DAY_NAMES[dayKey]}
          </h2>
        )}
        {combinedItems.map((item) =>
          item.type === 'regular'
            ? renderClassItem(item.data, dayKey)
            : renderMakeupClassItem(item.data)
        )}
      </div>
    );
  };

  if (showAllDays) {
    const allDaysContent = DAYS_ORDER.map((dayKey) => {
      const daySchedule = data[dayKey] || [];
      return renderDaySchedule(dayKey, daySchedule);
    }).filter(Boolean);

    if (allDaysContent.length === 0) {
      return (
        <div className="w-full max-w-3xl">
          <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
            <p className="text-muted-foreground">
              {subjectFilter
                ? 'Дисципліну не знайдено'
                : teacherFilter
                  ? 'Немає пар у цього викладача'
                  : 'Немає пар на цей тиждень'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="w-full max-w-3xl space-y-4">{allDaysContent}</div>
        {selectedClass && (
          <>
            <CancelClassModal
              isOpen={cancelModalOpen}
              onClose={() => setCancelModalOpen(false)}
              classId={selectedClass.id}
              day={selectedClass.day}
              subjectName={selectedClass.subject}
              onCancelled={handleCancelled}
            />
            <OnlineClassModal
              isOpen={onlineModalOpen}
              onClose={() => setOnlineModalOpen(false)}
              classId={selectedClass.id}
              day={selectedClass.day}
              subjectName={selectedClass.subject}
              classTime={selectedClass.time}
              onUpdated={handleOnlineUpdated}
            />
            <SubstituteModal
              isOpen={substituteModalOpen}
              onClose={() => setSubstituteModalOpen(false)}
              classId={selectedClass.id}
              day={selectedClass.day}
              subjectName={selectedClass.subject}
              onUpdated={handleSubstituteUpdated}
            />
          </>
        )}
      </>
    );
  }

  const currentDay = day || 'monday';
  const daySchedule = data[currentDay] || [];
  const filteredSchedule = filterSchedule(
    daySchedule,
    subgroup,
    weekType,
    subjectFilter,
    teacherFilter,
    classTypeFilter
  );
  const currentDayMakeupClasses = getMakeupClassesForDay(currentDay);

  // Combine and sort by class number for single day view
  type CombinedItemSingle =
    | { type: 'regular'; data: ScheduleItem; number: number }
    | { type: 'makeup'; data: MakeupClass; number: number };

  const combinedCurrentDay: CombinedItemSingle[] = [
    ...filteredSchedule.map((item) => ({
      type: 'regular' as const,
      data: item,
      number: item.number,
    })),
    ...currentDayMakeupClasses.map((makeup) => ({
      type: 'makeup' as const,
      data: makeup,
      number: makeup.classNumber,
    })),
  ].sort((a, b) => a.number - b.number);

  return (
    <>
      <div className="w-full max-w-3xl space-y-3">
        {combinedCurrentDay.map((item) =>
          item.type === 'regular'
            ? renderClassItem(item.data, currentDay)
            : renderMakeupClassItem(item.data)
        )}

        {combinedCurrentDay.length === 0 && (
          <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
            <p className="text-muted-foreground">
              {subjectFilter
                ? 'Дисципліну не знайдено'
                : teacherFilter
                  ? 'Немає пар у цього викладача'
                  : 'Немає пар на цей день'}
            </p>
          </div>
        )}
      </div>

      {selectedClass && (
        <>
          <CancelClassModal
            isOpen={cancelModalOpen}
            onClose={() => setCancelModalOpen(false)}
            classId={selectedClass.id}
            day={selectedClass.day}
            subjectName={selectedClass.subject}
            onCancelled={handleCancelled}
          />
          <OnlineClassModal
            isOpen={onlineModalOpen}
            onClose={() => setOnlineModalOpen(false)}
            classId={selectedClass.id}
            day={selectedClass.day}
            subjectName={selectedClass.subject}
            classTime={selectedClass.time}
            onUpdated={handleOnlineUpdated}
          />
          <SubstituteModal
            isOpen={substituteModalOpen}
            onClose={() => setSubstituteModalOpen(false)}
            classId={selectedClass.id}
            day={selectedClass.day}
            subjectName={selectedClass.subject}
            onUpdated={handleSubstituteUpdated}
          />
        </>
      )}
    </>
  );
}
