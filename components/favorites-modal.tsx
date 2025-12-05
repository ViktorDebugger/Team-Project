'use client';

import { useState, useEffect } from 'react';
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

/** localStorage keys */
const SAVED_GROUPS_KEY = 'savedGroups';
const SAVED_TEACHERS_KEY = 'savedTeachers';
const NOTIFICATIONS_KEY = 'notificationsEnabled';

interface FavoriteItem {
  name: string;
  type: 'group' | 'teacher';
}

/** Schedule mode type */
type ScheduleMode = 'group' | 'teacher';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGroup: string;
  currentTeacher: string;
  scheduleMode: ScheduleMode;
  onGroupSelect: (group: string) => void;
  onTeacherSelect: (teacher: string) => void;
}

/**
 * Modal for displaying saved groups and teachers with notification toggles.
 */
export function FavoritesModal({
  isOpen,
  onClose,
  currentGroup,
  currentTeacher,
  scheduleMode,
  onGroupSelect,
  onTeacherSelect,
}: FavoritesModalProps) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    {}
  );

  // Load saved items and notifications from localStorage
  useEffect(() => {
    if (isOpen) {
      const groups = localStorage.getItem(SAVED_GROUPS_KEY);
      const teachers = localStorage.getItem(SAVED_TEACHERS_KEY);
      const savedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);

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
      setNotifications(
        savedNotifications ? JSON.parse(savedNotifications) : {}
      );
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

    const itemKey = `${item.type}-${item.name}`;

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

    // Remove notification setting
    const newNotifications = { ...notifications };
    delete newNotifications[itemKey];
    setNotifications(newNotifications);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifications));

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
    const newNotifications = {
      ...notifications,
      [itemKey]: !notifications[itemKey],
    };
    setNotifications(newNotifications);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newNotifications));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const isItemActive = (item: FavoriteItem) => {
    // Only highlight if the item type matches the current schedule mode
    if (item.type === 'group' && scheduleMode === 'group') {
      return currentGroup === item.name;
    }
    if (item.type === 'teacher' && scheduleMode === 'teacher') {
      return currentTeacher === item.name;
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
                <div className="flex items-center gap-2">
                  {/* Notification toggle - only for groups */}
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
                  {/* Delete button */}
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
