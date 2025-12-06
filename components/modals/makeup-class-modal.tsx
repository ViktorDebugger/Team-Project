'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Video, MapPin, ChevronDown, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks';

export const MAKEUP_CLASSES_KEY = 'makeupClasses';

export interface MakeupClass {
  id: string;
  day: string;
  classNumber: number;
  subject: string;
  groups: string[];
  type: 'Лекція' | 'Практична' | 'Лабораторна';
  isOnline: boolean;
  meetLink?: string;
  room?: string;
  teacher: string;
  message?: string;
  createdAt: string;
}

const CLASS_TIMES: { number: number; time: string }[] = [
  { number: 1, time: '8:30-9:50' },
  { number: 2, time: '10:05-11:25' },
  { number: 3, time: '11:40-13:00' },
  { number: 4, time: '13:30-14:50' },
  { number: 5, time: '15:05-16:25' },
  { number: 6, time: '16:40-18:00' },
  { number: 7, time: '18:15-19:35' },
  { number: 8, time: '19:50-21:10' },
];

const DAYS = [
  { key: 'monday', label: 'Понеділок' },
  { key: 'tuesday', label: 'Вівторок' },
  { key: 'wednesday', label: 'Середа' },
  { key: 'thursday', label: 'Четвер' },
  { key: 'friday', label: "П'ятниця" },
];

const AVAILABLE_GROUPS = [
  'ОІ-31',
  'ОІ-32',
  'ОІ-33',
  'ОІ-34',
  'ОІ-35',
  'КІ-31',
  'КІ-32',
  'КІ-33',
  'КІ-34',
  'ПЗ-31',
  'ПЗ-32',
  'ПЗ-33',
];

const CLASS_TYPES: ('Лекція' | 'Практична' | 'Лабораторна')[] = [
  'Лекція',
  'Практична',
  'Лабораторна',
];

interface MakeupClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  onCreated: () => void;
}

function generateMeetLink(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segment = () =>
    Array.from(
      { length: 3 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  return `https://meet.google.com/${segment()}-${segment()}-${segment()}`;
}

export function MakeupClassModal({
  isOpen,
  onClose,
  teacherName,
  onCreated,
}: MakeupClassModalProps) {
  const [day, setDay] = useState('monday');
  const [classNumber, setClassNumber] = useState(1);
  const [subject, setSubject] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [classType, setClassType] = useState<
    'Лекція' | 'Практична' | 'Лабораторна'
  >('Практична');
  const [isOnline, setIsOnline] = useState(false);
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGroupsDropdownOpen, setIsGroupsDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [makeupClasses, setMakeupClasses] = useLocalStorage<MakeupClass[]>(
    MAKEUP_CLASSES_KEY,
    []
  );
  const groupsDropdownRef = useRef<HTMLDivElement>(null);
  const dayDropdownRef = useRef<HTMLDivElement>(null);
  const classDropdownRef = useRef<HTMLDivElement>(null);

  const filteredGroups = AVAILABLE_GROUPS.filter((group) =>
    group.toLowerCase().includes(groupSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        groupsDropdownRef.current &&
        !groupsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGroupsDropdownOpen(false);
      }
      if (
        dayDropdownRef.current &&
        !dayDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDayDropdownOpen(false);
      }
      if (
        classDropdownRef.current &&
        !classDropdownRef.current.contains(event.target as Node)
      ) {
        setIsClassDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manage body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and prevent body scrolling
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore scroll position and body scrolling
        const scrollY = parseInt(document.body.style.top || '0') * -1;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setDay('monday');
    setClassNumber(1);
    setSubject('');
    setSelectedGroups([]);
    setClassType('Практична');
    setIsOnline(false);
    setRoom('');
    setMessage('');
    setError('');
    setGroupSearch('');
    setIsGroupsDropdownOpen(false);
    setIsDayDropdownOpen(false);
    setIsClassDropdownOpen(false);
  };

  const handleToggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
    setError('');
  };

  const handleRemoveGroup = (group: string) => {
    setSelectedGroups((prev) => prev.filter((g) => g !== group));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!subject.trim()) {
      setError('Введіть назву предмету');
      return;
    }

    if (selectedGroups.length === 0) {
      setError('Оберіть хоча б одну групу');
      return;
    }

    if (!isOnline && !room.trim()) {
      setError('Вкажіть аудиторію для очної пари');
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const newMakeupClass: MakeupClass = {
      id: `makeup-${Date.now()}`,
      day,
      classNumber,
      subject: subject.trim(),
      groups: selectedGroups,
      type: classType,
      isOnline,
      meetLink: isOnline ? generateMeetLink() : undefined,
      room: isOnline ? undefined : room.trim(),
      teacher: teacherName,
      message: message.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setMakeupClasses([...makeupClasses, newMakeupClass]);

    setIsLoading(false);
    resetForm();
    onCreated();
    onClose();
  };

  const selectedClassTime = CLASS_TIMES.find((c) => c.number === classNumber);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} className="text-green-600" />
            Призначити пару відпрацювання
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                День тижня
              </label>
              <div className="relative" ref={dayDropdownRef}>
                <button
                  type="button"
                  onClick={() =>
                    !isLoading && setIsDayDropdownOpen(!isDayDropdownOpen)
                  }
                  className="w-full px-3 py-2 rounded-xl border bg-background text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <span>{DAYS.find((d) => d.key === day)?.label}</span>
                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform ${
                      isDayDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isDayDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-card border rounded-xl shadow-lg overflow-hidden">
                    {DAYS.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => {
                          setDay(d.key);
                          setIsDayDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 text-left text-sm transition-colors ${
                          day === d.key
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Номер пари
              </label>
              <div className="relative" ref={classDropdownRef}>
                <button
                  type="button"
                  onClick={() =>
                    !isLoading && setIsClassDropdownOpen(!isClassDropdownOpen)
                  }
                  className="w-full px-3 py-2 rounded-xl border bg-background text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <span>{classNumber} пара</span>
                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform ${
                      isClassDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isClassDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-card border rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
                    {CLASS_TIMES.map((c) => (
                      <button
                        key={c.number}
                        type="button"
                        onClick={() => {
                          setClassNumber(c.number);
                          setIsClassDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 text-left text-sm transition-colors ${
                          classNumber === c.number
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <span className="font-medium">{c.number} пара</span>
                        <span className="text-xs ml-2 opacity-70">
                          {c.time}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Назва предмету
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setError('');
              }}
              placeholder="Наприклад: Математичний аналіз"
              className="w-full px-3 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Групи</label>
            <div className="relative" ref={groupsDropdownRef}>
              <div
                className="min-h-[42px] px-3 py-2 rounded-xl border bg-background flex flex-wrap gap-1.5 cursor-pointer"
                onClick={() => setIsGroupsDropdownOpen(true)}
              >
                {selectedGroups.length > 0 ? (
                  selectedGroups.map((group) => (
                    <span
                      key={group}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-lg text-sm"
                    >
                      {group}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGroup(group);
                        }}
                        className="hover:text-green-900"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">
                    Оберіть групи...
                  </span>
                )}
                <ChevronDown
                  size={18}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform ${
                    isGroupsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {isGroupsDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-card border rounded-xl shadow-lg">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      value={groupSearch}
                      onChange={(e) => setGroupSearch(e.target.value)}
                      placeholder="Пошук групи..."
                      className="w-full px-3 py-1.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto p-1">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <button
                          key={group}
                          type="button"
                          onClick={() => handleToggleGroup(group)}
                          className={`w-full px-3 py-1.5 text-left text-sm rounded-lg transition-colors ${
                            selectedGroups.includes(group)
                              ? 'bg-green-100 text-green-700 font-medium'
                              : 'hover:bg-muted'
                          }`}
                        >
                          {group}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Групу не знайдено
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Тип заняття
            </label>
            <div className="flex gap-2">
              {CLASS_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setClassType(type)}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    classType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  disabled={isLoading}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Формат проведення
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOnline(false)}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  !isOnline
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                disabled={isLoading}
              >
                <MapPin size={16} />
                Очно
              </button>
              <button
                type="button"
                onClick={() => setIsOnline(true)}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  isOnline
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
                disabled={isLoading}
              >
                <Video size={16} />
                Онлайн
              </button>
            </div>
          </div>

          {!isOnline && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Аудиторія
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => {
                  setRoom(e.target.value);
                  setError('');
                }}
                placeholder="Наприклад: 305 V н.к"
                className="w-full px-3 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
            </div>
          )}

          {isOnline && (
            <div className="p-3 bg-primary/10 rounded-xl text-sm text-primary">
              <div className="flex items-center gap-2 font-medium">
                <Video size={16} />
                Посилання на Google Meet буде згенеровано автоматично
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Повідомлення для студентів (опціонально)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Наприклад: Відпрацювання лабораторної роботи №3..."
              className="w-full px-3 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={2}
              disabled={isLoading}
            />
          </div>

          <div className="p-3 bg-muted rounded-xl text-sm space-y-1">
            <div className="font-medium">Підсумок:</div>
            <div className="text-muted-foreground">
              {DAYS.find((d) => d.key === day)?.label},{' '}
              {selectedClassTime?.number} пара ({selectedClassTime?.time})
            </div>
            {subject && (
              <div className="text-muted-foreground">
                Предмет: {subject} ({classType})
              </div>
            )}
            {selectedGroups.length > 0 && (
              <div className="text-muted-foreground">
                Групи: {selectedGroups.join(', ')}
              </div>
            )}
            <div className="text-muted-foreground">
              Формат: {isOnline ? 'Онлайн' : `Очно (${room || '...'})`}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <DialogFooter className="gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl border font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Створити пару
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
