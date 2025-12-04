'use client';

import { useState, useEffect } from 'react';
import { Search, Bookmark } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/** localStorage keys */
const SAVED_GROUPS_KEY = 'savedGroups';
const SAVED_TEACHERS_KEY = 'savedTeachers';

/** Mock groups data */
const GROUPS = [
  'ОІ-35',
  'ОІ-34',
  'ОІ-33',
  'ПІ-24',
  'ПІ-23',
  'ПІ-22',
  'КН-31',
  'КН-32',
  'КІ-21',
  'КІ-22',
  'ІПЗ-11',
  'ІПЗ-12',
];

/** Mock teachers data */
const TEACHERS = [
  'Сікора Л.С',
  'Петренко О.І',
  'Коваль М.П',
  'Шевченко Н.В',
  'Бондар А.С',
  'Мельник І.О',
  'Ткачук В.М',
  'Гнатюк Р.П',
  'Іванов С.С',
  'Савчук Т.М',
  'Грищенко В.В',
  'Бойко А.А',
  'Литвин О.М',
  'Данилюк І.В',
  'Кравчук О.П',
  'Романюк Л.П',
];

/** Search type */
type SearchType = 'groups' | 'teachers';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGroup: string;
  currentTeacher: string;
  onGroupSelect: (group: string) => void;
  onTeacherSelect: (teacher: string) => void;
}

/**
 * Modal for searching and selecting a group or teacher.
 */
export function SearchModal({
  isOpen,
  onClose,
  currentGroup,
  currentTeacher,
  onGroupSelect,
  onTeacherSelect,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('groups');
  const [savedGroups, setSavedGroups] = useState<string[]>([]);
  const [savedTeachers, setSavedTeachers] = useState<string[]>([]);

  // Load saved items from localStorage
  useEffect(() => {
    const groups = localStorage.getItem(SAVED_GROUPS_KEY);
    const teachers = localStorage.getItem(SAVED_TEACHERS_KEY);
    if (groups) setSavedGroups(JSON.parse(groups));
    if (teachers) setSavedTeachers(JSON.parse(teachers));
  }, []);

  const items = searchType === 'groups' ? GROUPS : TEACHERS;
  const savedItems = searchType === 'groups' ? savedGroups : savedTeachers;
  const currentItem = searchType === 'groups' ? currentGroup : currentTeacher;

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: saved items first
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aIsSaved = savedItems.includes(a);
    const bIsSaved = savedItems.includes(b);
    if (aIsSaved && !bIsSaved) return -1;
    if (!aIsSaved && bIsSaved) return 1;
    return 0;
  });

  const handleItemSelect = (item: string) => {
    if (searchType === 'groups') {
      onGroupSelect(item);
    } else {
      onTeacherSelect(item);
    }
    onClose();
    setSearchQuery('');
  };

  const handleSaveToggle = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();

    if (searchType === 'groups') {
      const newSaved = savedGroups.includes(item)
        ? savedGroups.filter((g) => g !== item)
        : [...savedGroups, item];
      setSavedGroups(newSaved);
      localStorage.setItem(SAVED_GROUPS_KEY, JSON.stringify(newSaved));
    } else {
      const newSaved = savedTeachers.includes(item)
        ? savedTeachers.filter((t) => t !== item)
        : [...savedTeachers, item];
      setSavedTeachers(newSaved);
      localStorage.setItem(SAVED_TEACHERS_KEY, JSON.stringify(newSaved));
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setSearchQuery('');
    }
  };

  const isItemSaved = (item: string) => savedItems.includes(item);
  const isItemActive = (item: string) => currentItem === item;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Пошук</DialogTitle>
        </DialogHeader>

        {/* Search type toggle */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => {
              setSearchType('groups');
              setSearchQuery('');
            }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === 'groups'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Групи
          </button>
          <button
            onClick={() => {
              setSearchType('teachers');
              setSearchQuery('');
            }}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              searchType === 'teachers'
                ? 'bg-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Викладачі
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder={
              searchType === 'groups'
                ? 'Введіть назву групи...'
                : "Введіть ім'я викладача..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            autoFocus
          />
        </div>

        {/* Items list */}
        <div className="max-h-80 overflow-y-auto -mx-2">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <div
                key={item}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isItemActive(item)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleItemSelect(item)}
              >
                <span>{item}</span>
                <button
                  onClick={(e) => handleSaveToggle(e, item)}
                  className={`p-1 rounded transition-colors ${
                    isItemActive(item)
                      ? 'hover:bg-primary-foreground/20'
                      : 'hover:bg-muted-foreground/20'
                  }`}
                  title={isItemSaved(item) ? 'Видалити з обраних' : 'Зберегти'}
                >
                  <Bookmark
                    size={18}
                    className={
                      isItemSaved(item) ? 'fill-current' : 'fill-transparent'
                    }
                  />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {searchType === 'groups'
                ? 'Групу не знайдено'
                : 'Викладача не знайдено'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
