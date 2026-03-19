import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI Study Groups',
    template: '%s | AI Study Groups',
  },
  description: 'Collaborative AI-powered study groups for accelerated learning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Skip-to-content link for keyboard and screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Skip to main content
        </a>
        {/* #main-content is provided by AppShell (protected routes) or the
            individual page layout (auth routes). The skip link above uses it
            as its target regardless of which layout is active. */}
        {children}
      </body>
    </html>
  );
}
