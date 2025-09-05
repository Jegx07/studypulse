export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      job_recommendations: {
        Row: {
          created_at: string | null
          id: string
          is_applied: boolean | null
          is_bookmarked: boolean | null
          job_role_id: string | null
          match_percentage: number | null
          matching_skills: Json | null
          missing_skills: Json | null
          recommendation_reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_applied?: boolean | null
          is_bookmarked?: boolean | null
          job_role_id?: string | null
          match_percentage?: number | null
          matching_skills?: Json | null
          missing_skills?: Json | null
          recommendation_reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_applied?: boolean | null
          is_bookmarked?: boolean | null
          job_role_id?: string | null
          match_percentage?: number | null
          matching_skills?: Json | null
          missing_skills?: Json | null
          recommendation_reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_recommendations_job_role_id_fkey"
            columns: ["job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_roles: {
        Row: {
          company: string | null
          created_at: string | null
          description: string | null
          experience_level: string | null
          id: string
          is_active: boolean | null
          location: string | null
          posted_by: string | null
          preferred_skills: Json | null
          required_skills: Json | null
          salary_range: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          preferred_skills?: Json | null
          required_skills?: Json | null
          salary_range?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          experience_level?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          preferred_skills?: Json | null
          required_skills?: Json | null
          salary_range?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      motivation_tracking: {
        Row: {
          activity_level: number | null
          created_at: string | null
          date: string | null
          engagement_score: number | null
          heart_rate: number | null
          id: string
          motivation_score: number | null
          notes: string | null
          spo2_level: number | null
          user_id: string
          wearable_data: Json | null
        }
        Insert: {
          activity_level?: number | null
          created_at?: string | null
          date?: string | null
          engagement_score?: number | null
          heart_rate?: number | null
          id?: string
          motivation_score?: number | null
          notes?: string | null
          spo2_level?: number | null
          user_id: string
          wearable_data?: Json | null
        }
        Update: {
          activity_level?: number | null
          created_at?: string | null
          date?: string | null
          engagement_score?: number | null
          heart_rate?: number | null
          id?: string
          motivation_score?: number | null
          notes?: string | null
          spo2_level?: number | null
          user_id?: string
          wearable_data?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          career_aspirations: string | null
          created_at: string | null
          education: Json | null
          email: string
          experience: Json | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          resume_url: string | null
          skills: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          career_aspirations?: string | null
          created_at?: string | null
          education?: Json | null
          email: string
          experience?: Json | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          resume_url?: string | null
          skills?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          career_aspirations?: string | null
          created_at?: string | null
          education?: Json | null
          email?: string
          experience?: Json | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          resume_url?: string | null
          skills?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      progress_tracking: {
        Row: {
          achievements: Json | null
          completed_courses: Json | null
          created_at: string | null
          current_level: number | null
          id: string
          last_updated: string | null
          learning_resources: Json | null
          progress_percentage: number | null
          skill_name: string
          target_level: number | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          completed_courses?: Json | null
          created_at?: string | null
          current_level?: number | null
          id?: string
          last_updated?: string | null
          learning_resources?: Json | null
          progress_percentage?: number | null
          skill_name: string
          target_level?: number | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          completed_courses?: Json | null
          created_at?: string | null
          current_level?: number | null
          id?: string
          last_updated?: string | null
          learning_resources?: Json | null
          progress_percentage?: number | null
          skill_name?: string
          target_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      skill_gap_analysis: {
        Row: {
          created_at: string | null
          current_skills: Json | null
          id: string
          match_percentage: number | null
          missing_skills: Json | null
          recommendations: Json | null
          skill_gaps: Json | null
          target_job_role_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_skills?: Json | null
          id?: string
          match_percentage?: number | null
          missing_skills?: Json | null
          recommendations?: Json | null
          skill_gaps?: Json | null
          target_job_role_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_skills?: Json | null
          id?: string
          match_percentage?: number | null
          missing_skills?: Json | null
          recommendations?: Json | null
          skill_gaps?: Json | null
          target_job_role_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_gap_analysis_target_job_role_id_fkey"
            columns: ["target_job_role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills_master: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
