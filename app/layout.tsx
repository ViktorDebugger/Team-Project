import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "University Schedule",
  description: "University Schedule is a platform to manage schedule in University.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className=""
      >
        {children}
      </body>
    </html>
  );
}
