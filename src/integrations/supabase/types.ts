export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          availability_date: string | null
          created_at: string
          created_by: string | null
          current_company: string | null
          current_position: string | null
          email: string
          experience_years: number | null
          id: string
          linkedin_url: string | null
          name: string
          notes: string | null
          phone: string | null
          resume_url: string | null
          salary_expectation: number | null
          status: Database["public"]["Enums"]["candidate_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          availability_date?: string | null
          created_at?: string
          created_by?: string | null
          current_company?: string | null
          current_position?: string | null
          email: string
          experience_years?: number | null
          id?: string
          linkedin_url?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          resume_url?: string | null
          salary_expectation?: number | null
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          availability_date?: string | null
          created_at?: string
          created_by?: string | null
          current_company?: string | null
          current_position?: string | null
          email?: string
          experience_years?: number | null
          id?: string
          linkedin_url?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          resume_url?: string | null
          salary_expectation?: number | null
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          candidate_id: string
          document_name: string
          document_type: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          candidate_id: string
          document_name: string
          document_type: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          candidate_id?: string
          document_name?: string
          document_type?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          created_at: string
          created_by: string | null
          duration_minutes: number | null
          feedback: string | null
          id: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          interviewer_email: string
          interviewer_name: string
          location: string | null
          meeting_link: string | null
          notes: string | null
          position_candidate_id: string
          scheduled_date: string
          score: number | null
          status: Database["public"]["Enums"]["interview_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          interviewer_email: string
          interviewer_name: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          position_candidate_id: string
          scheduled_date: string
          score?: number | null
          status?: Database["public"]["Enums"]["interview_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type?: Database["public"]["Enums"]["interview_type"]
          interviewer_email?: string
          interviewer_name?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          position_candidate_id?: string
          scheduled_date?: string
          score?: number | null
          status?: Database["public"]["Enums"]["interview_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_position_candidate_id_fkey"
            columns: ["position_candidate_id"]
            isOneToOne: false
            referencedRelation: "position_candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      position_candidates: {
        Row: {
          applied_at: string
          candidate_id: string
          created_at: string
          id: string
          notes: string | null
          position_id: string
          status: Database["public"]["Enums"]["candidate_status"]
          updated_at: string
        }
        Insert: {
          applied_at?: string
          candidate_id: string
          created_at?: string
          id?: string
          notes?: string | null
          position_id: string
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
        }
        Update: {
          applied_at?: string
          candidate_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          position_id?: string
          status?: Database["public"]["Enums"]["candidate_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_candidates_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_candidates_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          approver: string
          benefits: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          created_by: string | null
          department: string
          expected_start_date: string | null
          hr_responsible: string
          id: string
          job_title: string
          location: string
          manager_responsible: string
          observations: string | null
          opening_date: string
          position_code: string
          position_level: Database["public"]["Enums"]["position_level"]
          recruitment_type: Database["public"]["Enums"]["recruitment_type"]
          replaced_employee: string | null
          request_type: Database["public"]["Enums"]["request_type"]
          requirements: string
          salary: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          source_of_capture: string
          status: Database["public"]["Enums"]["position_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          approver: string
          benefits?: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string | null
          department: string
          expected_start_date?: string | null
          hr_responsible: string
          id?: string
          job_title: string
          location: string
          manager_responsible: string
          observations?: string | null
          opening_date: string
          position_code: string
          position_level: Database["public"]["Enums"]["position_level"]
          recruitment_type: Database["public"]["Enums"]["recruitment_type"]
          replaced_employee?: string | null
          request_type: Database["public"]["Enums"]["request_type"]
          requirements: string
          salary?: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          source_of_capture: string
          status?: Database["public"]["Enums"]["position_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          approver?: string
          benefits?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string | null
          department?: string
          expected_start_date?: string | null
          hr_responsible?: string
          id?: string
          job_title?: string
          location?: string
          manager_responsible?: string
          observations?: string | null
          opening_date?: string
          position_code?: string
          position_level?: Database["public"]["Enums"]["position_level"]
          recruitment_type?: Database["public"]["Enums"]["recruitment_type"]
          replaced_employee?: string | null
          request_type?: Database["public"]["Enums"]["request_type"]
          requirements?: string
          salary?: number | null
          service_type?: Database["public"]["Enums"]["service_type"]
          source_of_capture?: string
          status?: Database["public"]["Enums"]["position_status"]
          updated_at?: string
          updated_by?: string | null
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
      candidate_status:
        | "applied"
        | "screening"
        | "interview"
        | "technical_test"
        | "final_interview"
        | "approved"
        | "rejected"
        | "hired"
      contract_type: "clt" | "internship" | "temporary" | "contractor"
      interview_status: "scheduled" | "completed" | "cancelled" | "rescheduled"
      interview_type: "screening" | "technical" | "behavioral" | "final"
      position_level: "strategic" | "tactical" | "operational"
      position_status: "draft" | "open" | "in_progress" | "closed" | "cancelled"
      recruitment_type: "internal" | "external"
      request_type: "replacement" | "headcount_increase" | "other"
      service_type: "internal" | "external_consultant" | "mixed"
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
    Enums: {
      candidate_status: [
        "applied",
        "screening",
        "interview",
        "technical_test",
        "final_interview",
        "approved",
        "rejected",
        "hired",
      ],
      contract_type: ["clt", "internship", "temporary", "contractor"],
      interview_status: ["scheduled", "completed", "cancelled", "rescheduled"],
      interview_type: ["screening", "technical", "behavioral", "final"],
      position_level: ["strategic", "tactical", "operational"],
      position_status: ["draft", "open", "in_progress", "closed", "cancelled"],
      recruitment_type: ["internal", "external"],
      request_type: ["replacement", "headcount_increase", "other"],
      service_type: ["internal", "external_consultant", "mixed"],
    },
  },
} as const
