'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardData } from '@/types/auth';
import { 
  User, Mail, Phone, MapPin, Building, Briefcase, 
  Sparkles, ShieldCheck, Database, Zap, Activity, 
  Server, RefreshCw, CheckCircle2, Layers
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout, refreshUser } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // If user is not authenticated and auth check is done, redirect to / (login)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch dashboard mock metrics from FastAPI when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDashboardData(token);
    }
  }, [isAuthenticated, token]);

  const fetchDashboardData = async (authToken: string) => {
    setLoadingMetrics(true);
    try {
      const res = await fetch('/api/dashboard/metrics', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data: DashboardData = await res.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.error('Failed to fetch dashboard metrics:', e);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const handleRefresh = async () => {
    if (!token) return;
    setRefreshing(true);
    await Promise.all([
      refreshUser(),
      fetchDashboardData(token)
    ]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <div className="pulse-dot" style={{ width: '20px', height: '20px' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Verifying security tokens...
        </div>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: '1280px', margin: '32px auto 60px', padding: '0 24px' }}>
      {/* Top Welcome Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: 'var(--emerald-400)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '10px',
          }}>
            <div className="pulse-dot" style={{ width: '6px', height: '6px' }} />
            <span>JWT Bearer Token Active (Route: /home)</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Welcome to your Home, <span className="text-gradient">{user.full_name}</span>!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
            Here is your registered profile information from local MongoDB alongside live FastAPI telemetry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleRefresh}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
            disabled={refreshing}
            id="btn-refresh-dashboard"
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
            id="btn-logout-home"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* SECTION 1: USER REGISTRATION PROFILE SHOWCASE */}
      <section style={{ marginBottom: '36px' }}>
        <div className="glass-panel" style={{
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(20, 27, 45, 0.85) 0%, rgba(13, 18, 30, 0.95) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          boxShadow: 'var(--shadow-glow)',
        }}>
          {/* User Header Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '24px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '20px',
                background: 'var(--grad-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '2rem',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              }}>
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {user.full_name}
                  </h2>
                  <span className="badge badge-primary">
                    @{user.username}
                  </span>
                  <span className="badge badge-success">
                    Verified Member
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  color: 'var(--cyan-400)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  marginTop: '6px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={15} />
                    {user.role || 'Full-Stack Developer'}
                  </span>
                  {user.company && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                      <Building size={15} />
                      {user.company}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Database & Token Pill */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
            }}>
              <div style={{ color: 'var(--text-dim)', marginBottom: '4px' }}>
                MongoDB Document ID:
              </div>
              <div style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>
                {user.id}
              </div>
              <div style={{ color: 'var(--text-dim)', marginTop: '6px', marginBottom: '2px' }}>
                Registration Timestamp:
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                {new Date(user.created_at).toLocaleDateString(undefined, { 
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </div>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}>
            {/* Contact & Location */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
                Contact & Location
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={16} color="var(--primary-500)" />
                  <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={16} color="var(--emerald-400)" />
                  <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{user.phone || 'Not provided'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} color="var(--rose-500)" />
                  <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{user.location || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Bio / About */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
                Biography & Summary
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {user.bio ? user.bio : 'No personal bio added during registration.'}
              </p>
            </div>

            {/* Registered Skills */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '12px' }}>
                Registered Skills & Tech Stack
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill) => (
                    <span key={skill} className="badge badge-info" style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DYNAMIC MOCK METRICS (KPIs & ANALYTICS) */}
      <section>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={22} color="var(--cyan-400)" />
              <span>Live System Analytics</span>
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>
              Random and dynamic telemetry streamed directly from FastAPI endpoints
            </p>
          </div>
          {loadingMetrics && (
            <span className="badge badge-warning">Loading API data...</span>
          )}
        </div>

        {/* 4 KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}>
          {dashboardData?.kpis.map((kpi) => (
            <div key={kpi.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {kpi.label}
                </span>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan-400)',
                }}>
                  {kpi.icon === 'zap' && <Zap size={18} />}
                  {kpi.icon === 'server' && <Server size={18} />}
                  {kpi.icon === 'database' && <Database size={18} />}
                  {kpi.icon === 'shield' && <ShieldCheck size={18} />}
                </div>
              </div>

              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                {kpi.value}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: 'var(--emerald-400)',
                fontWeight: 600,
              }}>
                <span>{kpi.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Grid: Hourly Traffic Chart + Activity Feed */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}>
          {/* Hourly Telemetry Visualizer */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>FastAPI Request Throughput</h3>
              <span className="badge badge-primary">24h History</span>
            </div>

            {/* Bar visualization */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '160px',
              paddingTop: '20px',
              gap: '12px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '12px',
            }}>
              {dashboardData?.system_telemetry.map((t, idx) => {
                const maxVal = 18000;
                const heightPercent = Math.min(100, Math.round((t.requests / maxVal) * 100));
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: `${heightPercent}%`,
                        background: 'linear-gradient(180deg, var(--cyan-400) 0%, var(--primary-600) 100%)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.4s ease',
                      }}
                      title={`${t.hour}: ${t.requests.toLocaleString()} reqs (${t.latency}ms latency)`}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {t.hour}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '16px',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}>
              <span>Avg Latency: <strong style={{ color: 'var(--emerald-400)' }}>14.8 ms</strong></span>
              <span>Peak Load: <strong style={{ color: 'var(--cyan-400)' }}>16,900 req/s</strong></span>
            </div>
          </div>

          {/* Live Activities Feed */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Security & Event Logs</h3>
              <span className="badge badge-success">Live Auditing</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {dashboardData?.recent_activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: act.status === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: act.status === 'success' ? 'var(--emerald-400)' : 'var(--primary-500)',
                    flexShrink: 0,
                  }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {act.title}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {act.timestamp}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {act.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pinned Projects Section */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--primary-500)" />
            <span>Active Workspaces</span>
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
          }}>
            {dashboardData?.pinned_projects.map((proj) => (
              <div
                key={proj.id}
                style={{
                  padding: '18px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{proj.name}</div>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{proj.status}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
                  {proj.stack}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontWeight: 600, color: 'var(--cyan-400)' }}>{proj.progress}%</span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${proj.progress}%`,
                      background: 'var(--grad-primary)',
                      borderRadius: '3px',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
