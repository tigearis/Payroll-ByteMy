/**
 * Holiday Domain Types
 */

export interface Holiday {
  id: string;
  date: string;
  local_name: string;
  name: string;
  country_code: string;
  region?: string[];
  is_fixed: boolean;
  is_global: boolean;
  launch_year?: number;
  types: string[];
  created_at: string;
  updated_at: string;
}