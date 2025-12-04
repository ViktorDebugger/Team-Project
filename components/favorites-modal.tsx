'use client';

import { useState, useEffect } from 'react';
import { Users, GraduationCap, Trash2, Bookmark } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/** localStorage keys */
const SAVED_GROUPS_KEY = 'savedGroups';
const SAVED_TEACHERS_KEY = 'savedTeachers';

interface FavoriteItem {
  name: string;
  type: 'group' | 'teacher';
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGroup: string;
  currentTeacher: string;
  onGroupSelect: (group: string) => void;
  onTeacherSelect: (teacher: string) => void;
}

/**
 * Modal for displaying saved groups and teachers.
 */
export function FavoritesModal({
  isOpen,
  onClose,
  currentGroup,
  currentTeacher,
  onGroupSelect,
  onTeacherSelect,
}: FavoritesModalProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load saved items from localStorage
  useEffect(() => {
    if (isOpen) {
      const groups = localStorage.getItem(SAVED_GROUPS_KEY);
      const teachers = localStorage.getItem(SAVED_TEACHERS_KEY);

      const savedGroups: FavoriteItem[] = groups
        ? JSON.parse(groups).map((name: string) => ({
            name,
            type: 'group' as const,
          }))
        : [];
      const savedTeachers: FavoriteItem[] = teachers
        ? JSON.parse(teachers).map((name: string) => ({
            name,
            type: 'teacher' as const,
          }))
        : [];

      setFavorites([...savedGroups, ...savedTeachers]);
    }
  }, [isOpen]);

  const handleItemSelect = (item: FavoriteItem) => {
    if (item.type === 'group') {
      onGroupSelect(item.name);
    } else {
      onTeacherSelect(item.name);
    }
    onClose();
  };

  const handleRemove = (e: React.MouseEvent, item: FavoriteItem) => {
    e.stopPropagation();

    if (item.type === 'group') {
      const groups = localStorage.getItem(SAVED_GROUPS_KEY);
      const savedGroups: string[] = groups ? JSON.parse(groups) : [];
      const newSaved = savedGroups.filter((g) => g !== item.name);
      localStorage.setItem(SAVED_GROUPS_KEY, JSON.stringify(newSaved));
    } else {
      const teachers = localStorage.getItem(SAVED_TEACHERS_KEY);
      const savedTeachers: string[] = teachers ? JSON.parse(teachers) : [];
      const newSaved = savedTeachers.filter((t) => t !== item.name);
      localStorage.setItem(SAVED_TEACHERS_KEY, JSON.stringify(newSaved));
    }

    setFavorites(
      favorites.filter((f) => !(f.name === item.name && f.type === item.type))
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const isItemActive = (item: FavoriteItem) => {
    if (item.type === 'group') {
      return currentGroup === item.name;
    }
    return currentTeacher === item.name;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Збережені</DialogTitle>
        </DialogHeader>

        {/* Items list */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {favorites.length > 0 ? (
            favorites.map((item) => (
              <div
                key={`${item.type}-${item.name}`}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isItemActive(item)
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
                onClick={() => handleItemSelect(item)}
              >
                <div className="flex items-center gap-3">
                  {item.type === 'group' ? (
                    <Users
                      size={18}
                      className={
                        isItemActive(item)
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground'
                      }
                    />
                  ) : (
                    <GraduationCap
                      size={18}
                      className={
                        isItemActive(item)
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground'
                      }
                    />
                  )}
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span
                      className={`text-xs ml-2 ${
                        isItemActive(item)
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.type === 'group' ? 'Група' : 'Викладач'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => handleRemove(e, item)}
                  className={`p-1 rounded transition-colors ${
                    isItemActive(item)
                      ? 'hover:bg-primary-foreground/20 text-primary-foreground'
                      : 'hover:bg-destructive/10 text-destructive'
                  }`}
                  title="Видалити"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bookmark
                size={48}
                className="mx-auto text-muted-foreground/50 mb-4"
              />
              <p className="text-muted-foreground">
                Немає збережених елементів
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Додайте групи або викладачів через пошук
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
