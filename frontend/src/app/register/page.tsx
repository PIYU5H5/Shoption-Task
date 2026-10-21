'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  User, Mail, Lock, Briefcase, Building, MapPin, 
  Phone, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles, X, Plus
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Next.js 15', 'FastAPI', 'MongoDB', 'Python', 
  'TypeScript', 'Docker', 'GraphQL', 'TailwindCSS', 'Redis'
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Full-Stack Engineer');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>(['Next.js', 'FastAPI', 'MongoDB']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, router]);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFillDemoData = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFullName('Piyush Sharma');
    setUsername(`piyush_${randomSuffix}`);
    setEmail(`piyush_${randomSuffix}@shoption.test`);
    setPassword('Piyush@Secure2026!');
    setConfirmPassword('Piyush@Secure2026!');
    setRole('Senior Cloud & Backend Architect');
    setCompany('Shoption Technologies');
    setLocation('Bengaluru, Karnataka');
    setPhone('+91 98765 43210');
    setBio('Building scalable distributed microservices with FastAPI, MongoDB, and modern Next.js interfaces.');
    setSkills(['FastAPI', 'MongoDB', 'Next.js 15', 'Python', 'JWT Security', 'Docker']);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const payload = {
      full_name: fullName,
      username: username,
      email: email,
      password: password,
      role: role || 'Software Developer',
      company: company || '',
      location: location || '',
      phone: phone || '',
      bio: bio || '',
      skills: skills,
    };

    const res = await register(payload);

    if (res.success) {
      setSuccessMessage('Registration successful! Redirecting to your dashboard...');
      setTimeout(() => {
        router.push('/home');
      }, 900);
    } else {
      setErrorMessage(res.error || 'Failed to complete registration.');
      setLoading(false);
    }
  };

  return (
    <main style={{
      maxWidth: '960px',
      margin: '40px auto 60px',
      padding: '0 20px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: '#a5b4fc',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '16px',
        }}>
          <Sparkles size={16} />
          <span>MongoDB Local User Registration</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Create Your <span className="text-gradient">Profile</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
          Register your account with full profile details. Your information will be safely encrypted, stored in your local MongoDB, and rendered dynamically on your home dashboard.
        </p>

        {/* Demo Auto-Fill Button */}
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            onClick={handleFillDemoData}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '7px 16px', borderRadius: 'var(--radius-full)' }}
            id="btn-fill-demo-register"
          >
            ⚡ Autofill Sample Details
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
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <AlertCircle size={20} />
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
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <CheckCircle2 size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Registration Form Card */}
      <div className="glass-panel" style={{ padding: '36px' }}>
        <form onSubmit={handleSubmit} id="form-register">
          
          {/* Section 1: Credentials */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '10px',
            }}>
              <Lock size={18} color="var(--primary-500)" />
              <span>1. Account Credentials</span>
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-fullname">
                  <User size={15} />
                  <span>Full Name *</span>
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-username">
                  <User size={15} />
                  <span>Username *</span>
                </label>
                <input
                  id="reg-username"
                  type="text"
                  required
                  placeholder="e.g. alexmercer"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="reg-email">
                  <Mail size={15} />
                  <span>Email Address *</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-password">
                  <Lock size={15} />
                  <span>Password *</span>
                </label>
                <input
                  id="reg-password"
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-confirmpassword">
                  <Lock size={15} />
                  <span>Confirm Password *</span>
                </label>
                <input
                  id="reg-confirmpassword"
                  type="password"
                  required
                  placeholder="Re-enter password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Profile & Role Information */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '10px',
            }}>
              <Briefcase size={18} color="var(--cyan-400)" />
              <span>2. Professional Information (Displayed on Home Page)</span>
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px',
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-role">
                  <Briefcase size={15} />
                  <span>Professional Role / Headline</span>
                </label>
                <input
                  id="reg-role"
                  type="text"
                  placeholder="e.g. Lead Full-Stack Architect"
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-company">
                  <Building size={15} />
                  <span>Company / Organization</span>
                </label>
                <input
                  id="reg-company"
                  type="text"
                  placeholder="e.g. Acme Innovations"
                  className="form-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-location">
                  <MapPin size={15} />
                  <span>Location</span>
                </label>
                <input
                  id="reg-location"
                  type="text"
                  placeholder="e.g. San Francisco, CA or Bengaluru"
                  className="form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="reg-phone">
                  <Phone size={15} />
                  <span>Phone Number</span>
                </label>
                <input
                  id="reg-phone"
                  type="text"
                  placeholder="e.g. +1 (555) 019-2834"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="reg-bio">
                  <FileText size={15} />
                  <span>Bio / About Yourself</span>
                </label>
                <textarea
                  id="reg-bio"
                  rows={3}
                  placeholder="Tell us about your background, interests, or what you are currently building..."
                  className="form-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Technical Skills Tags */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '10px',
            }}>
              <Sparkles size={18} color="var(--emerald-400)" />
              <span>3. Skills & Technologies</span>
            </h2>

            {/* Selected Skills Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {skills.map((s) => (
                <span
                  key={s}
                  className="badge badge-primary"
                  style={{ fontSize: '0.82rem', padding: '6px 12px', cursor: 'pointer' }}
                  onClick={() => handleRemoveSkill(s)}
                  title="Click to remove"
                >
                  {s}
                  <X size={13} style={{ marginLeft: '4px' }} />
                </span>
              ))}
            </div>

            {/* Add Custom Skill */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', maxWidth: '400px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add custom skill (e.g. PyTorch)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(customSkillInput);
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleAddSkill(customSkillInput)}
                style={{ padding: '0 16px' }}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Quick Add Suggestions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginRight: '6px' }}>Suggestions:</span>
              {SUGGESTED_SKILLS.map((suggested) => (
                <button
                  type="button"
                  key={suggested}
                  onClick={() => handleAddSkill(suggested)}
                  disabled={skills.includes(suggested)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: skills.includes(suggested) ? 'rgba(255,255,255,0.03)' : 'rgba(255, 255, 255, 0.08)',
                    color: skills.includes(suggested) ? 'var(--text-dim)' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    cursor: skills.includes(suggested) ? 'default' : 'pointer',
                  }}
                >
                  +{suggested}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Already registered?{' '}
              <Link href="/" style={{ color: 'var(--cyan-400)', fontWeight: 600, textDecoration: 'none' }}>
                Sign In here
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ minWidth: '180px' }}
              id="btn-submit-register"
            >
              {loading ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
