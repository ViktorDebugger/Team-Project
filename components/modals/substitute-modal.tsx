'use client';

import { useState, useRef, useEffect } from 'react';
import { UserCheck, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks';

export const SUBSTITUTED_CLASSES_KEY = 'substitutedClasses';

export interface SubstitutedClass {
  classId: string;
  day: string;
  substituteTeacher: string;
  message?: string;
  createdAt: string;
}

const AVAILABLE_TEACHERS = [
  'Петренко О.І',
  'Ковальчук А.М',
  'Савчук Т.М',
  'Коваль М.П',
  'Грищенко В.В',
  'Бойко А.А',
  'Шевченко Н.В',
  'Литвин О.М',
  'Бондар А.С',
  'Мельник І.О',
  'Іванов С.С',
  'Ткачук В.М',
  'Романюк Л.П',
  'Гнатюк Р.П',
  'Данилюк І.В',
  'Кравчук О.П',
  'Потужний В.П',
  'Сидоренко К.Л',
  'Марченко Д.О',
];

interface SubstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  day: string;
  subjectName: string;
  onUpdated: () => void;
  substitutedClasses: SubstitutedClass[];
  setSubstitutedClasses: React.Dispatch<
    React.SetStateAction<SubstitutedClass[]>
  >;
}

export function SubstituteModal({
  isOpen,
  onClose,
  classId,
  day,
  subjectName,
  onUpdated,
  substitutedClasses,
  setSubstitutedClasses,
}: SubstituteModalProps) {
  const [substituteTeacher, setSubstituteTeacher] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredTeachers = AVAILABLE_TEACHERS.filter((teacher) =>
    teacher.toLowerCase().includes(substituteTeacher.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
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
      setSubstituteTeacher('');
      setMessage('');
      setError('');
      setIsDropdownOpen(false);
      onClose();
    }
  };

  const handleSelectTeacher = (teacher: string) => {
    setSubstituteTeacher(teacher);
    setIsDropdownOpen(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!substituteTeacher.trim()) {
      setError('Оберіть або введіть ПІБ викладача');
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const newSubstitution: SubstitutedClass = {
      classId,
      day,
      substituteTeacher: substituteTeacher.trim(),
      message: message.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = substitutedClasses.findIndex(
      (c) => c.classId === classId && c.day === day
    );

    if (existingIndex >= 0) {
      setSubstitutedClasses(
        substitutedClasses.map((c, i) =>
          i === existingIndex ? newSubstitution : c
        )
      );
    } else {
      setSubstitutedClasses([...substitutedClasses, newSubstitution]);
    }

    setIsLoading(false);
    setSubstituteTeacher('');
    setMessage('');
    setIsDropdownOpen(false);
    onUpdated();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck size={20} className="text-orange-600" />
            Призначити заміну
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Призначити заміну для пари{' '}
              <span className="font-semibold text-foreground">
                &quot;{subjectName}&quot;
              </span>
            </p>

            <div className="space-y-2">
              <label
                htmlFor="substitute-teacher"
                className="text-sm font-medium text-foreground"
              >
                ПІБ викладача, який буде заміняти пару
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="substitute-teacher"
                    type="text"
                    value={substituteTeacher}
                    onChange={(e) => {
                      setSubstituteTeacher(e.target.value);
                      setIsDropdownOpen(true);
                      setError('');
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Почніть вводити ПІБ..."
                    className="w-full px-3 py-2 pr-10 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-card border rounded-xl shadow-lg"
                  >
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map((teacher) => (
                        <button
                          key={teacher}
                          type="button"
                          onClick={() => handleSelectTeacher(teacher)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl ${
                            substituteTeacher === teacher
                              ? 'bg-orange-50 text-orange-700 font-medium'
                              : ''
                          }`}
                        >
                          {teacher}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Викладача не знайдено
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="substitute-message"
              className="text-sm font-medium text-foreground"
            >
              Повідомлення для студентів (опціонально)
            </label>
            <textarea
              id="substitute-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Наприклад: Тема заняття залишається без змін..."
              className="w-full px-3 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
              disabled={isLoading}
            />
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
              className="px-4 py-2 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserCheck size={16} />
              )}
              Призначити заміну
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
