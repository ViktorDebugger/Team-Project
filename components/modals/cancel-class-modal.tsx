'use client';

import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks';

export const CANCELLED_CLASSES_KEY = 'cancelledClasses';

export interface CancelledClass {
  classId: string;
  day: string;
  message?: string;
  cancelledAt: string;
}

interface CancelClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  day: string;
  subjectName: string;
  onCancelled: () => void;
  cancelledClasses: CancelledClass[];
  setCancelledClasses: React.Dispatch<React.SetStateAction<CancelledClass[]>>;
}

export function CancelClassModal({
  isOpen,
  onClose,
  classId,
  day,
  subjectName,
  onCancelled,
  cancelledClasses,
  setCancelledClasses,
}: CancelClassModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const newCancellation: CancelledClass = {
      classId,
      day,
      message: message.trim() || undefined,
      cancelledAt: new Date().toISOString(),
    };

    const existingIndex = cancelledClasses.findIndex(
      (c) => c.classId === classId && c.day === day
    );

    if (existingIndex >= 0) {
      setCancelledClasses(
        cancelledClasses.map((c, i) =>
          i === existingIndex ? newCancellation : c
        )
      );
    } else {
      setCancelledClasses([...cancelledClasses, newCancellation]);
    }

    setIsLoading(false);
    setMessage('');
    onCancelled();
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setMessage('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle size={20} className="text-destructive" />
            Відмінити пару
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Ви впевнені, що хочете відмінити пару{' '}
              <span className="font-semibold text-foreground">
                &quot;{subjectName}&quot;
              </span>
              ?
            </p>

            <label
              htmlFor="message"
              className="text-sm font-medium text-foreground"
            >
              Повідомлення для студентів (опціонально)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Наприклад: Пара перенесена на наступний тиждень..."
              className="w-full mt-2 px-3 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
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
              className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
              ) : (
                <XCircle size={16} />
              )}
              Відмінити пару
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
