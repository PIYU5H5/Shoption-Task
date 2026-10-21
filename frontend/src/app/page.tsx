'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function RootLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // If already logged in, redirect straight to /home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/home');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const res = await login({
      username_or_email: usernameOrEmail,
      password: password,
    });

    if (res.success) {
      setSuccessMessage('Authentication verified! Loading your dashboard...');
      setTimeout(() => {
        router.push('/home');
      }, 600);
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please verify your login details.');
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsernameOrEmail('piyush_verified');
    setPassword('MySecurePassword2026!');
    setErrorMessage('');
  };

  return (
    <main style={{
      maxWidth: '480px',
      margin: '60px auto 80px',
      padding: '0 20px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--grad-primary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          marginBottom: '20px',
        }}>
          <ShieldCheck size={30} color="#ffffff" />
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Welcome <span className="text-gradient">Back</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Sign in to access your profile and personalized metrics powered by FastAPI & MongoDB.
        </p>

        {/* Demo filler */}
        <div style={{ marginTop: '14px' }}>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '5px 14px', borderRadius: 'var(--radius-full)' }}
          >
            ⚡ Autofill Test Account
          </button>
        </div>
      </div>

      {/* Error / Success Alerts */}
      {errorMessage && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fda4af',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem',
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem',
        }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Login Card */}
      <div className="glass-panel" style={{ padding: '36px' }}>
        <form onSubmit={handleSubmit} id="form-login">
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">
              <User size={15} />
              <span>Username or Email</span>
            </label>
            <input
              id="login-username"
              type="text"
              required
              placeholder="alex@example.com or alexmercer"
              className="form-input"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="login-password">
                <Lock size={15} />
                <span>Password</span>
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                className="form-input"
                style={{ paddingRight: '44px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
            id="btn-submit-login"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <>
                <span>Sign In with JWT</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--cyan-400)', fontWeight: 600, textDecoration: 'none' }}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
