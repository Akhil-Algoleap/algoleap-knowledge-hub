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
  name: string;
  email: string;
  created_at: string;
}
