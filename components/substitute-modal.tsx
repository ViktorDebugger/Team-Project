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

/** localStorage key for substituted classes */
export const SUBSTITUTED_CLASSES_KEY = 'substitutedClasses';

/** Substituted class info */
export interface SubstitutedClass {
  classId: string;
  day: string;
  substituteTeacher: string;
  message?: string;
  createdAt: string;
}

/** Available teachers list */
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
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Class ID */
  classId: string;
  /** Day of the class */
  day: string;
  /** Subject name for display */
  subjectName: string;
  /** Callback after successful update */
  onUpdated: () => void;
}

/**
 * Modal for assigning a substitute teacher with searchable dropdown.
 * @param {SubstituteModalProps} props - Component props
 * @returns {JSX.Element} Substitute modal
 * @example
 * <SubstituteModal isOpen={isOpen} onClose={onClose} classId="1" day="monday" subjectName="Math" onUpdated={refetch} />
 */
export function SubstituteModal({
  isOpen,
  onClose,
  classId,
  day,
  subjectName,
  onUpdated,
}: SubstituteModalProps) {
  const [substituteTeacher, setSubstituteTeacher] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter teachers based on input
  const filteredTeachers = AVAILABLE_TEACHERS.filter((teacher) =>
    teacher.toLowerCase().includes(substituteTeacher.toLowerCase())
  );

  // Close dropdown when clicking outside
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

  /**
   * Handles modal close.
   */
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSubstituteTeacher('');
      setMessage('');
      setError('');
      setIsDropdownOpen(false);
      onClose();
    }
  };

  /**
   * Handles teacher selection from dropdown.
   */
  const handleSelectTeacher = (teacher: string) => {
    setSubstituteTeacher(teacher);
    setIsDropdownOpen(false);
    setError('');
  };

  /**
   * Handles form submission.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!substituteTeacher.trim()) {
      setError('Оберіть або введіть ПІБ викладача');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Save to localStorage
    const existingData = localStorage.getItem(SUBSTITUTED_CLASSES_KEY);
    const substitutedClasses: SubstitutedClass[] = existingData
      ? JSON.parse(existingData)
      : [];

    const newSubstitution: SubstitutedClass = {
      classId,
      day,
      substituteTeacher: substituteTeacher.trim(),
      message: message.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    // Check if already exists
    const existingIndex = substitutedClasses.findIndex(
      (c) => c.classId === classId && c.day === day
    );

    if (existingIndex >= 0) {
      substitutedClasses[existingIndex] = newSubstitution;
    } else {
      substitutedClasses.push(newSubstitution);
    }

    localStorage.setItem(
      SUBSTITUTED_CLASSES_KEY,
      JSON.stringify(substitutedClasses)
    );

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

            {/* Substitute teacher searchable dropdown */}
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

                {/* Dropdown list */}
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

          {/* Optional message */}
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

          {/* Error message */}
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
