export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills?: string[];
  company?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserProfile;
}

export interface RegisterPayload {
  full_name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills: string[];
  company?: string;
}

export interface LoginPayload {
  username_or_email: string;
  password: string;
}

export interface DashboardKPI {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface SystemTelemetry {
  hour: string;
  requests: number;
  latency: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  badge: string;
  status: 'success' | 'info' | 'warning' | 'error';
}

export interface ProjectItem {
  id: string;
  name: string;
  stack: string;
  status: string;
  progress: number;
}

export interface DashboardData {
  kpis: DashboardKPI[];
  system_telemetry: SystemTelemetry[];
  recent_activities: ActivityItem[];
  pinned_projects: ProjectItem[];
}
