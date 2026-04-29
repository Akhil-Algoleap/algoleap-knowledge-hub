export type ArtifactStatus = 'current' | 'needs-update' | 'archived'

export interface Artifact {
  id:             string
  title:          string
  description:    string | null
  artifact_type:  string
  service_line:   string[]
  industry:       string[]
  audience:       string[]
  tech_tags:      string[]
  onedrive_url:   string
  owner_name:     string | null
  owner_email:    string | null
  status:         ArtifactStatus
  is_client_safe: boolean
  created_at:     string
  updated_at:     string
}

export interface Profile {
  id:    string
  email: string
  role:  'viewer' | 'admin'
}

export interface Employee {
  id: string;
  s_no?: number;
  joining_date?: string;
  employee_id?: string;
  employee_name: string;
  designation?: string;
  department?: string;
  reporting_manager?: string;
  client?: string;
  work_place?: string;
  email_id: string;
  contact_number?: string;
  laptop_serial_no?: string;
  status?: string;
  skills?: string;
  role?: string;
  practice?: string;
  created_at?: string;
}
