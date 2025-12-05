'use client';

import { useState } from 'react';
import {
  Users,
  GraduationCap,
  Trash2,
  Bookmark,
  Bell,
  BellOff,
} from 'lucide-react';
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
const NOTIFICATIONS_KEY = 'notificationsEnabled';

interface FavoriteItem {
  name: string;
  type: 'group' | 'teacher';
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
  const {
    selectedGroup,
    selectedTeacher,
    scheduleMode,
    selectGroup,
    selectTeacher,
  } = useSchedule();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [savedGroups] = useLocalStorage<string[]>(SAVED_GROUPS_KEY, []);
  const [savedTeachers] = useLocalStorage<string[]>(SAVED_TEACHERS_KEY, []);
  const [notifications, setNotifications] = useLocalStorage<
    Record<string, boolean>
  >(NOTIFICATIONS_KEY, {});

  useState(() => {
    if (isOpen) {
      const savedGroupsItems: FavoriteItem[] = savedGroups.map(
        (name: string) => ({
          name,
          type: 'group' as const,
        })
      );
      const savedTeachersItems: FavoriteItem[] = savedTeachers.map(
        (name: string) => ({
          name,
          type: 'teacher' as const,
        })
      );

      setFavorites([...savedGroupsItems, ...savedTeachersItems]);
    }
  });

  const handleItemSelect = (item: FavoriteItem) => {
    if (item.type === 'group') {
      selectGroup(item.name);
    } else {
      selectTeacher(item.name);
    }
    onClose();
  };

  const handleRemove = (e: React.MouseEvent, item: FavoriteItem) => {
    e.stopPropagation();

    const itemKey = `${item.type}-${item.name}`;

    if (item.type === 'group') {
      setSavedGroups(savedGroups.filter((g) => g !== item.name));
    } else {
      setSavedTeachers(savedTeachers.filter((t) => t !== item.name));
    }

    const newNotifications = { ...notifications };
    delete newNotifications[itemKey];
    setNotifications(newNotifications);

    setFavorites(
      favorites.filter((f) => !(f.name === item.name && f.type === item.type))
    );
  };

  const handleToggleNotification = (
    e: React.MouseEvent,
    item: FavoriteItem
  ) => {
    e.stopPropagation();
    const itemKey = `${item.type}-${item.name}`;
    setNotifications({
      ...notifications,
      [itemKey]: !notifications[itemKey],
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const isItemActive = (item: FavoriteItem) => {
    if (item.type === 'group' && scheduleMode === 'group') {
      return selectedGroup === item.name;
    }
    if (item.type === 'teacher' && scheduleMode === 'teacher') {
      return selectedTeacher === item.name;
    }
    return false;
  };

  const isNotificationEnabled = (item: FavoriteItem) => {
    const itemKey = `${item.type}-${item.name}`;
    return notifications[itemKey] ?? false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Збережені</DialogTitle>
        </DialogHeader>

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
                <div className="flex items-center gap-2">
                  {item.type === 'group' && (
                    <button
                      onClick={(e) => handleToggleNotification(e, item)}
                      className={`p-1.5 rounded transition-colors ${
                        isItemActive(item)
                          ? isNotificationEnabled(item)
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'hover:bg-primary-foreground/10 text-primary-foreground/50'
                          : isNotificationEnabled(item)
                            ? 'bg-green-100 text-green-700'
                            : 'hover:bg-muted text-muted-foreground'
                      }`}
                      title={
                        isNotificationEnabled(item)
                          ? 'Вимкнути сповіщення'
                          : 'Увімкнути сповіщення'
                      }
                    >
                      {isNotificationEnabled(item) ? (
                        <Bell size={16} />
                      ) : (
                        <BellOff size={16} />
                      )}
                    </button>
                  )}
                  <button
                    onClick={(e) => handleRemove(e, item)}
                    className={`p-1.5 rounded transition-colors ${
                      isItemActive(item)
                        ? 'hover:bg-primary-foreground/20 text-primary-foreground'
                        : 'hover:bg-destructive/10 text-destructive'
                    }`}
                    title="Видалити"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
