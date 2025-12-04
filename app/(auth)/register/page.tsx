'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { USER_KEY, UserData } from '@/components/auth-form';
import { GoogleButton } from '@/components/google-button';

/**
 * Register page component.
 * @returns {JSX.Element} Register page
 */
export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validates email format.
   */
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /**
   * Handles form submission.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !isValidEmail(email)) {
      setError('Введіть коректну електронну пошту');
      return;
    }

    if (!password.trim()) {
      setError('Введіть пароль');
      return;
    }

    if (password.length < 6) {
      setError('Пароль має бути не менше 6 символів');
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock registration - use email prefix as name
    const user: UserData = {
      name: email.split('@')[0],
      email,
      role,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setIsLoading(false);
    router.push('/');
  };

  return (
    <>
      <p className="text-muted-foreground text-center mb-6">
        Створіть новий акаунт
      </p>

      <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-4">
        {/* Google sign-in */}
        <GoogleButton text="Зареєструватися через Google" />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">або</span>
          </div>
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Електронна пошта
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="email"
                type="email"
                placeholder="example@lpnu.ua"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Пароль
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="password"
                type="password"
                placeholder="Введіть пароль..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm password field */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Підтвердження паролю
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Повторіть пароль..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Роль</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-colors ${
                  role === 'student'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted'
                }`}
                disabled={isLoading}
              >
                Студент
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-colors ${
                  role === 'teacher'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background hover:bg-muted'
                }`}
                disabled={isLoading}
              >
                Викладач
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={18} />
                <span>Зареєструватися</span>
              </>
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="text-center pt-2">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Вже є акаунт? Увійти
          </Link>
        </div>

        {/* Demo hint */}
        <p className="text-xs text-muted-foreground text-center">
          Для демо: введіть будь-які дані
        </p>
      </div>
    </>
  );
}
