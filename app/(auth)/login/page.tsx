'use client';

import { GoogleButton } from '@/components/google-button';

/**
 * Login page component with Google sign-in only.
 * @returns {JSX.Element} Login page
 */
export default function LoginPage() {
  return (
    <>
      <p className="text-muted-foreground text-center mb-6">
        Увійдіть до свого акаунту
      </p>

      <div className="bg-card rounded-2xl border shadow-lg p-6">
        {/* Google sign-in */}
        <GoogleButton text="Увійти через Google" />
      </div>
    </>
  );
}
