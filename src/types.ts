export interface Project {
  projectkey: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address?: string;
  project_name: string;
  project_description?: string;
  domain_url?: string;
  domain_expiry_date?: string;
  ssl_expiry_date?: string;
  server_expiry_date?: string;
  username?: string;
  password?: string;
  total_amount: string | number;
  status?: "pending" | "completed" | "in-progress";
  created_at?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  project: string;
  intent?: string;
  is_read: boolean | number;
  created_at: string;
}

export interface SystemStats {
  status: string;
  version: string;
  db_stats: {
    projects: number;
    leads: number;
    visits_today: number;
    visits_month: number;
    live_now: number;
  };
}
