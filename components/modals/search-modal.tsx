'use client';

import { useState } from 'react';
import { Search, Bookmark } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSchedule } from '@/contexts';
import { useLocalStorage } from '@/hooks';

const SAVED_GROUPS_KEY = 'savedGroups';
const SAVED_TEACHERS_KEY = 'savedTeachers';

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

const TEACHERS = [
  'Ковальчук А.М',
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

type SearchType = 'groups' | 'teachers';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { selectedGroup, selectedTeacher, selectGroup, selectTeacher } =
    useSchedule();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('groups');
  const [savedGroups, setSavedGroups] = useLocalStorage<string[]>(
    SAVED_GROUPS_KEY,
    []
  );
  const [savedTeachers, setSavedTeachers] = useLocalStorage<string[]>(
    SAVED_TEACHERS_KEY,
    []
  );

  const items = searchType === 'groups' ? GROUPS : TEACHERS;
  const savedItems = searchType === 'groups' ? savedGroups : savedTeachers;
  const currentItem = searchType === 'groups' ? selectedGroup : selectedTeacher;

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aIsSaved = savedItems.includes(a);
    const bIsSaved = savedItems.includes(b);
    if (aIsSaved && !bIsSaved) return -1;
    if (!aIsSaved && bIsSaved) return 1;
    return 0;
  });

  const handleItemSelect = (item: string) => {
    if (searchType === 'groups') {
      selectGroup(item);
    } else {
      selectTeacher(item);
    }
    onClose();
    setSearchQuery('');
  };

  const handleSaveToggle = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();

    if (searchType === 'groups') {
      setSavedGroups(
        savedGroups.includes(item)
          ? savedGroups.filter((g) => g !== item)
          : [...savedGroups, item]
      );
    } else {
      setSavedTeachers(
        savedTeachers.includes(item)
          ? savedTeachers.filter((t) => t !== item)
          : [...savedTeachers, item]
      );
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
