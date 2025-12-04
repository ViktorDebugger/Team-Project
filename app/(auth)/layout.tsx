import Image from 'next/image';

/**
 * Auth layout component with shared styling.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Auth layout
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
            <Image
              src="/logo-no-bg.png"
              alt="Розклад НУЛП"
              width={80}
              height={80}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Розклад НУЛП</h1>
        </div>

        {children}
      </div>
    </div>
  );
}
