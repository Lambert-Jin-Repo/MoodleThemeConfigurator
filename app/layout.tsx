import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CFA Moodle Theme Configurator',
  description: 'Design and export accessible Moodle Boost theme configurations for CFA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
