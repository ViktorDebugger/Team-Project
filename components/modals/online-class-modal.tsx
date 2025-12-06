'use client';

import { useState, useEffect } from 'react';
import { Video, Copy, Check, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks';

export const ONLINE_CLASSES_KEY = 'onlineClasses';

export interface OnlineClass {
  classId: string;
  day: string;
  meetLink: string;
  message?: string;
  createdAt: string;
}

interface OnlineClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  day: string;
  subjectName: string;
  classTime: string;
  onUpdated: () => void;
  onlineClasses: OnlineClass[];
  setOnlineClasses: React.Dispatch<React.SetStateAction<OnlineClass[]>>;
}

const generateMeetLink = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const part1 = Array.from(
    { length: 3 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  const part2 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  const part3 = Array.from(
    { length: 3 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `https://meet.google.com/${part1}-${part2}-${part3}`;
};

export function OnlineClassModal({
  isOpen,
  onClose,
  classId,
  day,
  subjectName,
  classTime,
  onUpdated,
  onlineClasses,
  setOnlineClasses,
}: OnlineClassModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [meetLink, setMeetLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
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
    if (open && !meetLink) {
      setMeetLink(generateMeetLink());
    }
    if (!open) {
      setMessage('');
      setMeetLink('');
      setIsCopied(false);
      onClose();
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(meetLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const newOnlineClass: OnlineClass = {
      classId,
      day,
      meetLink,
      message: message.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const existingIndex = onlineClasses.findIndex(
      (c) => c.classId === classId && c.day === day
    );

    if (existingIndex >= 0) {
      setOnlineClasses(
        onlineClasses.map((c, i) => (i === existingIndex ? newOnlineClass : c))
      );
    } else {
      setOnlineClasses([...onlineClasses, newOnlineClass]);
    }

    setIsLoading(false);
    setMessage('');
    setMeetLink('');
    onUpdated();
    onClose();
  };

  if (isOpen && !meetLink) {
    setMeetLink(generateMeetLink());
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video size={20} className="text-primary" />
            Перенести онлайн
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Пара{' '}
              <span className="font-semibold text-foreground">
                &quot;{subjectName}&quot;
              </span>{' '}
              о{' '}
              <span className="font-semibold text-foreground">{classTime}</span>{' '}
              буде проведена онлайн.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Посилання на Google Meet
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={meetLink}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-xl border bg-muted text-sm"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl border bg-background hover:bg-muted transition-colors flex items-center gap-1.5"
                  title="Копіювати посилання"
                >
                  {isCopied ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span className="text-sm text-green-600">
                        Скопійовано
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span className="text-sm">Копіювати</span>
                    </>
                  )}
                </button>
              </div>
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink size={14} />
                Відкрити в новій вкладці
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="online-message"
              className="text-sm font-medium text-foreground"
            >
              Повідомлення для студентів (опціонально)
            </label>
            <textarea
              id="online-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Наприклад: Заходьте о 8:25, почнемо вчасно..."
              className="w-full px-3 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

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
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Video size={16} />
              )}
              Перенести онлайн
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
