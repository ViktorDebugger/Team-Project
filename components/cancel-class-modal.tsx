'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

/** localStorage key for cancelled classes */
export const CANCELLED_CLASSES_KEY = 'cancelledClasses';

/** Cancelled class info */
export interface CancelledClass {
  classId: string;
  day: string;
  message?: string;
  cancelledAt: string;
}

interface CancelClassModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Class ID to cancel */
  classId: string;
  /** Day of the class */
  day: string;
  /** Subject name for display */
  subjectName: string;
  /** Callback after successful cancellation */
  onCancelled: () => void;
}

/**
 * Modal for cancelling a class with optional message.
 * @param {CancelClassModalProps} props - Component props
 * @returns {JSX.Element} Cancel class modal
 * @example
 * <CancelClassModal isOpen={isOpen} onClose={onClose} classId="1" day="monday" subjectName="Math" onCancelled={refetch} />
 */
export function CancelClassModal({
  isOpen,
  onClose,
  classId,
  day,
  subjectName,
  onCancelled,
}: CancelClassModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles cancellation submission.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Save to localStorage
    const existingData = localStorage.getItem(CANCELLED_CLASSES_KEY);
    const cancelled: CancelledClass[] = existingData
      ? JSON.parse(existingData)
      : [];

    const newCancellation: CancelledClass = {
      classId,
      day,
      message: message.trim() || undefined,
      cancelledAt: new Date().toISOString(),
    };

    // Check if already cancelled
    const existingIndex = cancelled.findIndex(
      (c) => c.classId === classId && c.day === day
    );

    if (existingIndex >= 0) {
      cancelled[existingIndex] = newCancellation;
    } else {
      cancelled.push(newCancellation);
    }

    localStorage.setItem(CANCELLED_CLASSES_KEY, JSON.stringify(cancelled));

    setIsLoading(false);
    setMessage('');
    onCancelled();
    onClose();
  };

  /**
   * Handles modal close.
   */
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

          <DialogFooter className="gap-2 sm:gap-0">
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
