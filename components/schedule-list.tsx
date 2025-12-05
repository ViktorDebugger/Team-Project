'use client';

import { useState, useEffect } from 'react';
import { XCircle, RotateCcw, AlertCircle } from 'lucide-react';
import scheduleData from '@/data/schedule.json';
import examsData from '@/data/exams.json';
import {
  CancelClassModal,
  CancelledClass,
  CANCELLED_CLASSES_KEY,
} from './cancel-class-modal';

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
}: ScheduleListProps) {
  const data = scheduleData as ScheduleData;
  const exams = examsData as ExamItem[];

  const [cancelledClasses, setCancelledClasses] = useState<CancelledClass[]>(
    []
  );
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    id: string;
    day: string;
    subject: string;
  } | null>(null);

  // Load cancelled classes from localStorage
  useEffect(() => {
    const loadCancelled = () => {
      const saved = localStorage.getItem(CANCELLED_CLASSES_KEY);
      if (saved) {
        setCancelledClasses(JSON.parse(saved));
      }
    };
    loadCancelled();

    // Listen for storage changes
    window.addEventListener('storage', loadCancelled);
    return () => window.removeEventListener('storage', loadCancelled);
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
   * Opens the cancel modal for a class.
   */
  const handleCancelClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string,
    subject: string
  ) => {
    e.stopPropagation();
    setSelectedClass({ id: classId, day: dayKey, subject });
    setCancelModalOpen(true);
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
    const isCancelled = !!cancelledInfo;

    return (
      <div
        key={item.id}
        className={`bg-card rounded-xl border shadow-sm p-4 relative ${
          isCancelled ? 'opacity-60 border-destructive/30' : ''
        }`}
      >
        {/* Cancelled badge */}
        {isCancelled && (
          <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <XCircle size={12} />
            Відмінено
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
              className="text-destructive mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-destructive">{cancelledInfo.message}</p>
          </div>
        )}

        <div className="flex justify-between items-end">
          <span className="text-muted-foreground">
            {teacherFilter
              ? item.subgroup
                ? `Підгрупа ${item.subgroup}`
                : 'Вся група'
              : item.teacher}
          </span>
          <div className="flex items-end gap-3">
            {/* Cancel/Restore button for teachers - only on their own classes */}
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
                  <button
                    onClick={(e) =>
                      handleCancelClick(e, item.id, dayKey, item.subject)
                    }
                    className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    title="Відмінити пару"
                  >
                    <XCircle size={16} />
                  </button>
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

    if (filteredSchedule.length === 0) {
      return null;
    }

    return (
      <div key={dayKey} className="space-y-3">
        {showAllDays && (
          <h2 className="text-lg font-semibold text-foreground/80 pt-2">
            {DAY_NAMES[dayKey]}
          </h2>
        )}
        {filteredSchedule.map((item) => renderClassItem(item, dayKey))}
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
          <CancelClassModal
            isOpen={cancelModalOpen}
            onClose={() => setCancelModalOpen(false)}
            classId={selectedClass.id}
            day={selectedClass.day}
            subjectName={selectedClass.subject}
            onCancelled={handleCancelled}
          />
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

  return (
    <>
      <div className="w-full max-w-3xl space-y-3">
        {filteredSchedule.map((item) => renderClassItem(item, currentDay))}

        {filteredSchedule.length === 0 && (
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
        <CancelClassModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          classId={selectedClass.id}
          day={selectedClass.day}
          subjectName={selectedClass.subject}
          onCancelled={handleCancelled}
        />
      )}
    </>
  );
}
