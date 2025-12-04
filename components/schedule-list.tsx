'use client';

import scheduleData from '@/data/schedule.json';
import examsData from '@/data/exams.json';

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
}: ScheduleListProps) {
  const data = scheduleData as ScheduleData;
  const exams = examsData as ExamItem[];

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
        {filteredSchedule.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-xl border shadow-sm p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-lg font-medium">{item.number} Пара</span>
              <span className="text-sm text-muted-foreground">
                {item.timeStart}-{item.timeEnd}
              </span>
            </div>

            <h3 className="text-xl font-semibold mb-3">{item.subject}</h3>

            <div className="flex justify-between items-end">
              <span className="text-muted-foreground">
                {teacherFilter
                  ? item.subgroup
                    ? `Підгрупа ${item.subgroup}`
                    : 'Вся група'
                  : item.teacher}
              </span>
              <div className="text-right">
                <div className="text-sm font-medium">{item.type}</div>
                <div className="text-sm text-muted-foreground">{item.room}</div>
              </div>
            </div>
          </div>
        ))}
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

    return <div className="w-full max-w-3xl space-y-4">{allDaysContent}</div>;
  }

  const daySchedule = data[day || 'monday'] || [];
  const filteredSchedule = filterSchedule(
    daySchedule,
    subgroup,
    weekType,
    subjectFilter,
    teacherFilter,
    classTypeFilter
  );

  return (
    <div className="w-full max-w-3xl space-y-3">
      {filteredSchedule.map((item) => (
        <div key={item.id} className="bg-card rounded-xl border shadow-sm p-4">
          <div className="flex justify-between items-start mb-3">
            <span className="text-lg font-medium">{item.number} Пара</span>
            <span className="text-sm text-muted-foreground">
              {item.timeStart}-{item.timeEnd}
            </span>
          </div>

          <h3 className="text-xl font-semibold mb-3">{item.subject}</h3>

          <div className="flex justify-between items-end">
            <span className="text-muted-foreground">
              {teacherFilter
                ? item.subgroup
                  ? `Підгрупа ${item.subgroup}`
                  : 'Вся група'
                : item.teacher}
            </span>
            <div className="text-right">
              <div className="text-sm font-medium">{item.type}</div>
              <div className="text-sm text-muted-foreground">{item.room}</div>
            </div>
          </div>
        </div>
      ))}

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
  );
}
