'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn } from 'lucide-react';
import { USER_KEY, UserData } from '@/components/auth-form';
import { GoogleButton } from '@/components/google-button';

/**
 * Login page component.
 * @returns {JSX.Element} Login page
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock authentication
    const user: UserData = {
      name: email.split('@')[0],
      email,
      role: 'student',
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setIsLoading(false);
    router.push('/');
  };

  return (
    <>
      <p className="text-muted-foreground text-center mb-6">
        Увійдіть до свого акаунту
      </p>

      <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-4">
        {/* Google sign-in */}
        <GoogleButton text="Увійти через Google" />

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
                <LogIn size={18} />
                <span>Увійти</span>
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center pt-2">
          <Link
            href="/register"
            className="text-sm text-primary hover:underline"
          >
            Немає акаунту? Зареєструватися
          </Link>
        </div>

        {/* Demo hint */}
        <p className="text-xs text-muted-foreground text-center">
          Для демо: введіть будь-яку пошту та пароль
        </p>
      </div>
    </>
  );
}
