'use client';

import Link from 'next/link';
import { GoogleButton } from '@/components/google-button';

/**
 * Register page component with Google sign-up only.
 * @returns {JSX.Element} Register page
 */
export default function RegisterPage() {
  return (
    <>
      <p className="text-muted-foreground text-center mb-6">
        Створіть новий акаунт
      </p>

      <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-4">
        {/* Google sign-up */}
        <GoogleButton text="Зареєструватися через Google" />

        {/* Login link */}
        <div className="text-center pt-2">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Вже є акаунт? Увійти
          </Link>
        </div>
      </div>
    </>
  );
}
