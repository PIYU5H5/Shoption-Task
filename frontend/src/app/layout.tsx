import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ShoptionHub • Next.js & FastAPI Full-Stack Auth Platform',
  description: 'Full-stack application featuring Next.js 15 App Router, FastAPI backend, MongoDB user persistence, and JWT access token authentication.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AuthProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
              {children}
            </div>
            <footer style={{
              borderTop: '1px solid var(--border-subtle)',
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-dim)',
              fontSize: '0.85rem',
              backgroundColor: 'rgba(7, 9, 14, 0.95)',
            }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  © 2026 <strong>ShoptionHub</strong> • Secured with JWT HS256 & MongoDB Local
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>FastAPI Uvicorn ASGI</span>
                  <span>•</span>
                  <span>Next.js 15</span>
                  <span>•</span>
                  <span>Motor Async Driver</span>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
