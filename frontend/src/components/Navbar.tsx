'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, LogOut, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo: points to /home if authenticated, / if not */}
        <Link href={isAuthenticated ? "/home" : "/"} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          color: 'var(--text-main)',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '1.2rem',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              Shoption<span className="text-gradient">Hub</span>
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Next.js 15 • FastAPI • MongoDB
            </div>
          </div>
        </Link>

        {/* Live System Badge */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }} className="system-pill">
          <div className="pulse-dot" />
          <span>MongoDB Local: 27017</span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span>FastAPI: 8000</span>
        </div>

        {/* Auth Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/home" style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 12px 6px 8px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--grad-cyan)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {user.full_name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--cyan-400)' }}>
                      @{user.username}
                    </div>
                  </div>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                title="Log Out"
                id="btn-navbar-logout"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                href="/"
                className="btn btn-secondary"
                style={{ padding: '9px 18px', fontSize: '0.9rem' }}
                id="btn-navbar-login"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{ padding: '9px 20px', fontSize: '0.9rem' }}
                id="btn-navbar-register"
              >
                <span>Register</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @media (min-width: 768px) {
          .system-pill {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
