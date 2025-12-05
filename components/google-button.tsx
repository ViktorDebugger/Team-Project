'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { USER_KEY, UserData } from './auth-form';

/**
 * Google icon component.
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/** Demo user presets */
const DEMO_USERS = {
  student: {
    name: 'Лука В.Ю',
    email: 'firstname.lastname.oi.2023@lpnu.ua',
  },
  teacher: {
    name: 'Петренко О.І',
    email: 'firstname.m.lastname@lpnu.ua',
  },
};

interface GoogleButtonProps {
  /** Text to display on the button */
  text?: string;
}

/**
 * Google sign-in button component with demo role selector.
 * @param {GoogleButtonProps} props - Component props
 * @returns {JSX.Element} Google button component
 * @example
 * <GoogleButton text="Увійти через Google" />
 */
export function GoogleButton({
  text = 'Продовжити з Google',
}: GoogleButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  /**
   * Handles Google sign-in.
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 800));

    const demoUser = DEMO_USERS[role];
    const user: UserData = {
      name: demoUser.name,
      email: demoUser.email,
      role,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setIsLoading(false);
    router.push('/');
  };

  return (
    <div className="space-y-4">
      {/* Demo role selector */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-xs text-amber-700 font-medium mb-2 text-center">
          🧪 Демо: оберіть роль
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              role === 'student'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background border hover:bg-muted'
            }`}
          >
            👨‍🎓 Студент
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              role === 'teacher'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background border hover:bg-muted'
            }`}
          >
            👨‍🏫 Викладач
          </button>
        </div>
        <p className="text-xs text-amber-600 mt-2 text-center">
          {role === 'student'
            ? `Увійдете як: ${DEMO_USERS.student.name}`
            : `Увійдете як: ${DEMO_USERS.teacher.name}`}
        </p>
      </div>

      {/* Google sign-in button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-background border rounded-xl font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
        ) : (
          <>
            <GoogleIcon />
            <span>{text}</span>
          </>
        )}
      </button>
    </div>
  );
}
