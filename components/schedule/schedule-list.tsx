'use client';

import { useState } from 'react';
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
import { useLocalStorage } from '@/hooks';
import {
  CancelClassModal,
  CancelledClass,
  CANCELLED_CLASSES_KEY,
} from '../modals/cancel-class-modal';
import {
  OnlineClassModal,
  OnlineClass,
  ONLINE_CLASSES_KEY,
} from '../modals/online-class-modal';
import {
  SubstituteModal,
  SubstitutedClass,
  SUBSTITUTED_CLASSES_KEY,
} from '../modals/substitute-modal';
import { MakeupClass, MAKEUP_CLASSES_KEY } from '../modals/makeup-class-modal';

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

type ScheduleData = {
  [key: string]: ScheduleItem[];
};

type ScheduleType = 'classes' | 'exams';

const DAY_NAMES: { [key: string]: string } = {
  monday: 'Понеділок',
  tuesday: 'Вівторок',
  wednesday: 'Середа',
  thursday: 'Четвер',
  friday: "П'ятниця",
};

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
  currentTeacherName?: string;
  selectedGroup?: string;
}

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

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  return date.toLocaleDateString('uk-UA', options);
};

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

  const [cancelledClasses, setCancelledClasses] = useLocalStorage<
    CancelledClass[]
  >(CANCELLED_CLASSES_KEY, []);
  const [onlineClasses, setOnlineClasses] = useLocalStorage<OnlineClass[]>(
    ONLINE_CLASSES_KEY,
    []
  );
  const [substitutedClasses, setSubstitutedClasses] = useLocalStorage<
    SubstitutedClass[]
  >(SUBSTITUTED_CLASSES_KEY, []);
  const [makeupClasses, setMakeupClasses] = useLocalStorage<MakeupClass[]>(
    MAKEUP_CLASSES_KEY,
    []
  );
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [onlineModalOpen, setOnlineModalOpen] = useState(false);
  const [substituteModalOpen, setSubstituteModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    id: string;
    day: string;
    subject: string;
    time: string;
  } | null>(null);

  const getCancelledInfo = (
    classId: string,
    dayKey: string
  ): CancelledClass | undefined => {
    return cancelledClasses.find(
      (c) => c.classId === classId && c.day === dayKey
    );
  };

  const getOnlineInfo = (
    classId: string,
    dayKey: string
  ): OnlineClass | undefined => {
    return onlineClasses.find((c) => c.classId === classId && c.day === dayKey);
  };

  const getSubstitutedInfo = (
    classId: string,
    dayKey: string
  ): SubstitutedClass | undefined => {
    return substitutedClasses.find(
      (c) => c.classId === classId && c.day === dayKey
    );
  };

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

  const handleRemoveOnlineClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string
  ) => {
    e.stopPropagation();
    setOnlineClasses(
      onlineClasses.filter((c) => !(c.classId === classId && c.day === dayKey))
    );
  };

  const handleRestoreClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string
  ) => {
    e.stopPropagation();
    setCancelledClasses(
      cancelledClasses.filter(
        (c) => !(c.classId === classId && c.day === dayKey)
      )
    );
  };

  const handleCancelled = () => {
    // Refresh will happen automatically via useLocalStorage
  };

  const handleOnlineUpdated = () => {
    // Refresh will happen automatically via useLocalStorage
  };

  const handleDeleteMakeupClass = (e: React.MouseEvent, makeupId: string) => {
    e.stopPropagation();
    setMakeupClasses(makeupClasses.filter((m) => m.id !== makeupId));
  };

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

  const handleRemoveSubstituteClick = (
    e: React.MouseEvent,
    classId: string,
    dayKey: string
  ) => {
    e.stopPropagation();
    setSubstitutedClasses(
      substitutedClasses.filter(
        (c) => !(c.classId === classId && c.day === dayKey)
      )
    );
  };

  const handleSubstituteUpdated = () => {
    // Refresh will happen automatically via useLocalStorage
  };

  if (scheduleType === 'exams') {
    const filteredExams = filterExams(exams, subjectFilter, teacherFilter);

    if (filteredExams.length === 0) {
      return (
        <div className="w-full max-w-3xl">
          <div className="bg-card rounded-lg sm:rounded-xl border shadow-sm p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
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
      <div className="w-full max-w-3xl space-y-2 sm:space-y-3">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-card rounded-lg sm:rounded-xl border shadow-sm p-3 sm:p-4"
          >
            {/* Header: Date + Time */}
            <div className="flex justify-between items-start mb-2 sm:mb-3">
              <span className="text-base sm:text-lg font-medium capitalize">
                {formatDate(exam.date)}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {exam.timeStart}-{exam.timeEnd}
              </span>
            </div>

            {/* Subject */}
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">
              {exam.subject}
            </h3>

            {/* Footer: Teacher + Type/Room */}
            <div className="flex justify-between items-end">
              <span className="text-sm sm:text-base text-muted-foreground">
                {exam.teacher}
              </span>
              <div className="text-right">
                <div
                  className={`text-xs sm:text-sm font-medium ${
                    exam.type === 'Екзамен'
                      ? 'text-destructive'
                      : 'text-primary'
                  }`}
                >
                  {exam.type}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {exam.room}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
        className={`bg-card rounded-lg sm:rounded-xl border shadow-sm p-3 sm:p-4 relative ${
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
          <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1">
            <XCircle size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Відмінено</span>
          </div>
        )}
        {isOnline && !isCancelled && (
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1">
            <Video size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Онлайн</span>
          </div>
        )}
        {isSubstituted && !isCancelled && !isOnline && (
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1">
            <UserCheck size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Заміна</span>
          </div>
        )}

        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <span
            className={`text-base sm:text-lg font-medium ${isCancelled ? 'line-through' : ''}`}
          >
            {item.number} Пара
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {item.timeStart}-{item.timeEnd}
          </span>
        </div>

        <h3
          className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 ${isCancelled ? 'line-through' : ''}`}
        >
          {item.subject}
        </h3>

        {/* Cancelled message */}
        {isCancelled && cancelledInfo.message && (
          <div className="mb-2 sm:mb-3 p-2 bg-destructive/10 rounded-lg flex items-start gap-1.5 sm:gap-2">
            <AlertCircle
              size={14}
              className="text-destructive mt-0.5 shrink-0 sm:w-4 sm:h-4"
            />
            <p className="text-xs sm:text-sm text-destructive">
              {cancelledInfo.message}
            </p>
          </div>
        )}

        {/* Online info with Meet link */}
        {isOnline && !isCancelled && (
          <div className="mb-2 sm:mb-3 p-2 bg-primary/10 rounded-lg space-y-1 sm:space-y-1.5">
            <a
              href={onlineInfo.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-primary hover:underline"
            >
              <Video size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">
                Приєднатися до Google Meet
              </span>
              <span className="sm:hidden">Google Meet</span>
              <ExternalLink size={10} className="sm:w-3 sm:h-3" />
            </a>
            {onlineInfo.message && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {onlineInfo.message}
              </p>
            )}
          </div>
        )}

        {/* Substitute info */}
        {isSubstituted && !isCancelled && (
          <div className="mb-2 sm:mb-3 p-2 bg-orange-50 rounded-lg space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium text-orange-700">
              <UserCheck size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>Заміна: {substitutedInfo.substituteTeacher}</span>
            </div>
            {substitutedInfo.message && (
              <p className="text-xs sm:text-sm text-orange-600/80">
                {substitutedInfo.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-between items-end gap-2">
          <div className="text-xs sm:text-sm text-muted-foreground min-w-0 shrink">
            {teacherFilter ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground truncate">
                  {item.groups?.join(', ') || 'Група'}
                </span>
                <span className="text-xs sm:text-sm">
                  {item.subgroup ? `Підгрупа ${item.subgroup}` : 'Вся група'}
                </span>
              </div>
            ) : isSubstituted ? (
              <div className="flex flex-col gap-0.5">
                <span className="line-through text-muted-foreground/60 truncate">
                  {item.teacher}
                </span>
                <span className="font-medium text-orange-700 truncate">
                  {substitutedInfo.substituteTeacher}
                </span>
              </div>
            ) : (
              <span className="truncate">{item.teacher}</span>
            )}
          </div>
          <div className="flex items-end gap-1 sm:gap-2 shrink-0">
            {/* Action buttons for teachers - only on their own classes */}
            {currentTeacherName && item.teacher === currentTeacherName && (
              <>
                {isCancelled ? (
                  <button
                    onClick={(e) => handleRestoreClick(e, item.id, dayKey)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium"
                    title="Відновити пару"
                  >
                    <RotateCcw size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Відновити</span>
                  </button>
                ) : (
                  <>
                    {/* Online button */}
                    {isOnline ? (
                      <button
                        onClick={(e) =>
                          handleRemoveOnlineClick(e, item.id, dayKey)
                        }
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium"
                        title="Відмінити онлайн"
                      >
                        <Video size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">
                          Відмінити онлайн
                        </span>
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
                        className="p-1 sm:p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title="Перенести онлайн"
                      >
                        <Video size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    )}
                    {/* Substitute button */}
                    {isSubstituted ? (
                      <button
                        onClick={(e) =>
                          handleRemoveSubstituteClick(e, item.id, dayKey)
                        }
                        className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium"
                        title="Відмінити заміну"
                      >
                        <UserCheck size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">
                          Відмінити заміну
                        </span>
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
                        className="p-1 sm:p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                        title="Призначити заміну"
                      >
                        <UserCheck size={14} className="sm:w-4 sm:h-4" />
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
                        className="p-1 sm:p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        title="Відмінити пару"
                      >
                        <XCircle size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            <div className="text-right">
              <div className="text-xs sm:text-sm font-medium">{item.type}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {item.room}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getMakeupClassesForDay = (dayKey: string): MakeupClass[] => {
    return makeupClasses.filter((makeup) => {
      if (makeup.day !== dayKey) return false;

      if (
        subjectFilter &&
        !makeup.subject.toLowerCase().includes(subjectFilter.toLowerCase())
      ) {
        return false;
      }

      if (classTypeFilter && makeup.type !== classTypeFilter) {
        return false;
      }

      if (teacherFilter) {
        return makeup.teacher === teacherFilter;
      }

      if (selectedGroup) {
        return makeup.groups.includes(selectedGroup);
      }

      return true;
    });
  };

  const renderMakeupClassItem = (makeup: MakeupClass) => {
    const classTime = CLASS_TIMES.find((c) => c.number === makeup.classNumber);

    return (
      <div
        key={makeup.id}
        className="bg-lime-50 rounded-lg sm:rounded-xl border border-lime-400 shadow-sm p-3 sm:p-4 relative"
      >
        {/* Makeup badge */}
        <div className="absolute -top-2 -right-2 bg-lime-500 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1">
          <Plus size={10} className="sm:w-3 sm:h-3" />
          <span className="hidden sm:inline">Відпрацювання</span>
        </div>

        {/* Online badge if applicable */}
        {makeup.isOnline && (
          <div className="absolute -top-2 left-2 bg-primary text-primary-foreground text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-0.5 sm:gap-1">
            <Video size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">Онлайн</span>
          </div>
        )}

        <div className="flex justify-between items-start mb-2">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            {makeup.classNumber} Пара
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {classTime?.time.replace('-', '-')}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-semibold mb-2">
          {makeup.subject}
        </h3>

        {/* Message if provided */}
        {makeup.message && (
          <div className="mb-2 sm:mb-3 p-2 bg-muted rounded-lg">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {makeup.message}
            </p>
          </div>
        )}

        {/* Online link if applicable */}
        {makeup.isOnline && makeup.meetLink && (
          <div className="mb-2 sm:mb-3 p-2 bg-primary/10 rounded-lg">
            <a
              href={makeup.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 text-primary hover:underline"
            >
              <ExternalLink size={12} className="sm:w-3.5 sm:h-3.5" />
              <span className="text-xs sm:text-sm font-medium">
                <span className="hidden sm:inline">
                  Приєднатися до Google Meet
                </span>
                <span className="sm:hidden">Google Meet</span>
              </span>
            </a>
          </div>
        )}

        <div className="flex justify-between items-end gap-2">
          <div className="text-xs sm:text-sm text-muted-foreground min-w-0 shrink">
            {teacherFilter ? (
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground truncate">
                  {makeup.groups.join(', ')}
                </span>
              </div>
            ) : (
              <span className="truncate">{makeup.teacher}</span>
            )}
          </div>
          <div className="flex items-end gap-1 sm:gap-3 shrink-0">
            {/* Delete button - only for the teacher who created it */}
            {currentTeacherName && makeup.teacher === currentTeacherName && (
              <button
                onClick={(e) => handleDeleteMakeupClass(e, makeup.id)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium"
                title="Відмінити відпрацювання"
              >
                <XCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Відмінити</span>
              </button>
            )}
            <div className="text-right">
              <div className="text-xs sm:text-sm font-medium">
                {makeup.type}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {makeup.isOnline ? 'Онлайн' : makeup.room}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      <div key={dayKey} className="space-y-2 sm:space-y-3">
        {showAllDays && (
          <h2 className="text-base sm:text-lg font-semibold text-foreground/80 pt-1 sm:pt-2">
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
          <div className="bg-card rounded-lg sm:rounded-xl border shadow-sm p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
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
        <div className="w-full max-w-3xl space-y-3 sm:space-y-4">
          {allDaysContent}
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
              cancelledClasses={cancelledClasses}
              setCancelledClasses={setCancelledClasses}
            />
            <OnlineClassModal
              isOpen={onlineModalOpen}
              onClose={() => setOnlineModalOpen(false)}
              classId={selectedClass.id}
              day={selectedClass.day}
              subjectName={selectedClass.subject}
              classTime={selectedClass.time}
              onUpdated={handleOnlineUpdated}
              onlineClasses={onlineClasses}
              setOnlineClasses={setOnlineClasses}
            />
            <SubstituteModal
              isOpen={substituteModalOpen}
              onClose={() => setSubstituteModalOpen(false)}
              classId={selectedClass.id}
              day={selectedClass.day}
              subjectName={selectedClass.subject}
              onUpdated={handleSubstituteUpdated}
              substitutedClasses={substitutedClasses}
              setSubstitutedClasses={setSubstitutedClasses}
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
      <div className="w-full max-w-3xl space-y-2 sm:space-y-3">
        {combinedCurrentDay.map((item) =>
          item.type === 'regular'
            ? renderClassItem(item.data, currentDay)
            : renderMakeupClassItem(item.data)
        )}

        {combinedCurrentDay.length === 0 && (
          <div className="bg-card rounded-lg sm:rounded-xl border shadow-sm p-6 sm:p-8 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
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
            cancelledClasses={cancelledClasses}
            setCancelledClasses={setCancelledClasses}
          />
          <OnlineClassModal
            isOpen={onlineModalOpen}
            onClose={() => setOnlineModalOpen(false)}
            classId={selectedClass.id}
            day={selectedClass.day}
            subjectName={selectedClass.subject}
            classTime={selectedClass.time}
            onUpdated={handleOnlineUpdated}
            onlineClasses={onlineClasses}
            setOnlineClasses={setOnlineClasses}
          />
          <SubstituteModal
            isOpen={substituteModalOpen}
            onClose={() => setSubstituteModalOpen(false)}
            classId={selectedClass.id}
            day={selectedClass.day}
            subjectName={selectedClass.subject}
            onUpdated={handleSubstituteUpdated}
            substitutedClasses={substitutedClasses}
            setSubstitutedClasses={setSubstitutedClasses}
          />
        </>
      )}
    </>
  );
}
